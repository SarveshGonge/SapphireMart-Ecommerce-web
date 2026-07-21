package com.sarvesh.ecommerce.controller;

import com.sarvesh.ecommerce.dto.SalesSummary;
import com.sarvesh.ecommerce.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/api/admin/analytics/sales")
    public ResponseEntity<SalesSummary> salesSummary(
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(analyticsService.getSalesSummary(year));
    }
}
