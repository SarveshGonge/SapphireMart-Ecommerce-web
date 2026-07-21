package com.sarvesh.ecommerce.controller;

import com.sarvesh.ecommerce.dto.CartItemRequest;
import com.sarvesh.ecommerce.model.CartItem;
import com.sarvesh.ecommerce.security.UserPrincipal;
import com.sarvesh.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getUser()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> add(@AuthenticationPrincipal UserPrincipal principal,
                                         @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(principal.getUser(), request));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> update(@AuthenticationPrincipal UserPrincipal principal,
                                            @PathVariable Long cartItemId,
                                            @RequestBody Map<String, Integer> body) {
        CartItem updated = cartService.updateQuantity(principal.getUser(), cartItemId, body.get("quantity"));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> remove(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long cartItemId) {
        cartService.removeItem(principal.getUser(), cartItemId);
        return ResponseEntity.noContent().build();
    }
}
