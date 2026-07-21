package com.sarvesh.ecommerce.controller;

import com.sarvesh.ecommerce.dto.CheckoutRequest;
import com.sarvesh.ecommerce.model.Order;
import com.sarvesh.ecommerce.model.OrderStatus;
import com.sarvesh.ecommerce.security.UserPrincipal;
import com.sarvesh.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/orders/checkout")
    public ResponseEntity<Order> checkout(@AuthenticationPrincipal UserPrincipal principal,
                                           @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(orderService.checkout(principal.getUser(), request));
    }

    @GetMapping("/api/orders")
    public ResponseEntity<Page<Order>> myOrders(@AuthenticationPrincipal UserPrincipal principal, Pageable pageable) {
        return ResponseEntity.ok(orderService.getUserOrders(principal.getUser(), pageable));
    }

    @GetMapping("/api/admin/orders")
    public ResponseEntity<Page<Order>> allOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @PatchMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
