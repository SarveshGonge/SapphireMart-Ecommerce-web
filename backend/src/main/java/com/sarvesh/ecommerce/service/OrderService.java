package com.sarvesh.ecommerce.service;

import com.sarvesh.ecommerce.dto.CheckoutRequest;
import com.sarvesh.ecommerce.exception.ApiException;
import com.sarvesh.ecommerce.model.*;
import com.sarvesh.ecommerce.repository.CartItemRepository;
import com.sarvesh.ecommerce.repository.OrderRepository;
import com.sarvesh.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PaymentService paymentService;

    @Transactional
    public Order checkout(User user, CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new ApiException("Cart is empty", HttpStatus.BAD_REQUEST);
        }

        PaymentService.PaymentResult payment = paymentService.processPayment(request);

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PLACED)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(payment.status())
                .paymentReference(payment.reference())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0.0;

        for (CartItem ci : cartItems) {
            Product product = ci.getProduct();
            if (product.getStock() < ci.getQuantity()) {
                throw new ApiException("Insufficient stock for " + product.getName(), HttpStatus.BAD_REQUEST);
            }
            product.setStock(product.getStock() - ci.getQuantity());
            productRepository.save(product);

            double lineTotal = product.getPrice() * ci.getQuantity();
            total += lineTotal;

            orderItems.add(OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(ci.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build());
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        cartItemRepository.deleteByUser(user);
        return saved;
    }

    public Page<Order> getUserOrders(User user, Pageable pageable) {
        return orderRepository.findByUserId(user.getId(), pageable);
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Order updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
