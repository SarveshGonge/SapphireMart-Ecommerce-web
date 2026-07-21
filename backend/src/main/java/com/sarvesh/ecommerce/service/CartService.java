package com.sarvesh.ecommerce.service;

import com.sarvesh.ecommerce.dto.CartItemRequest;
import com.sarvesh.ecommerce.exception.ApiException;
import com.sarvesh.ecommerce.model.CartItem;
import com.sarvesh.ecommerce.model.Product;
import com.sarvesh.ecommerce.model.User;
import com.sarvesh.ecommerce.repository.CartItemRepository;
import com.sarvesh.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final int MAX_QUANTITY_PER_ITEM = 10;

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public List<CartItem> getCart(User user) {
        return cartItemRepository.findByUserId(user.getId());
    }

    public CartItem addToCart(User user, CartItemRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));

        if (product.getStock() < req.getQuantity()) {
            throw new ApiException("Insufficient stock for " + product.getName(), HttpStatus.BAD_REQUEST);
        }

        return cartItemRepository.findByUserAndProduct(user, product)
                .map(existing -> {
                    int newQuantity = existing.getQuantity() + req.getQuantity();
                    existing.setQuantity(enforceMaxQuantity(newQuantity, product.getName()));
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> cartItemRepository.save(
                        CartItem.builder().user(user).product(product)
                                .quantity(enforceMaxQuantity(req.getQuantity(), product.getName()))
                                .build()));
    }

    public CartItem updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ApiException("Cart item not found", HttpStatus.NOT_FOUND));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new ApiException("Not authorized to modify this cart item", HttpStatus.FORBIDDEN);
        }
        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }
        item.setQuantity(enforceMaxQuantity(quantity, item.getProduct().getName()));
        return cartItemRepository.save(item);
    }

    public void removeItem(User user, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ApiException("Cart item not found", HttpStatus.NOT_FOUND));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new ApiException("Not authorized to modify this cart item", HttpStatus.FORBIDDEN);
        }
        cartItemRepository.delete(item);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    private int enforceMaxQuantity(int requestedQuantity, String productName) {
        if (requestedQuantity > MAX_QUANTITY_PER_ITEM) {
            throw new ApiException(
                    "You can add a maximum of " + MAX_QUANTITY_PER_ITEM + " units of \"" + productName
                            + "\" per order.",
                    HttpStatus.BAD_REQUEST);
        }
        return requestedQuantity;
    }
}
