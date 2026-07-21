package com.sarvesh.ecommerce.controller;

import com.sarvesh.ecommerce.dto.RazorpayOrderResponse;
import com.sarvesh.ecommerce.exception.ApiException;
import com.sarvesh.ecommerce.model.CartItem;
import com.sarvesh.ecommerce.security.UserPrincipal;
import com.sarvesh.ecommerce.service.CartService;
import com.sarvesh.ecommerce.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments/razorpay")
@RequiredArgsConstructor
public class RazorpayController {

    private final RazorpayService razorpayService;
    private final CartService cartService;

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@AuthenticationPrincipal UserPrincipal principal) {
        List<CartItem> cartItems = cartService.getCart(principal.getUser());
        if (cartItems.isEmpty()) {
            throw new ApiException("Cart is empty", HttpStatus.BAD_REQUEST);
        }

        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        JSONObject order = razorpayService.createOrder(total);

        RazorpayOrderResponse response = new RazorpayOrderResponse(
                order.getString("id"),
                order.getLong("amount"),
                order.getString("currency"),
                razorpayService.getPublicKeyId()
        );
        return ResponseEntity.ok(response);
    }
}
