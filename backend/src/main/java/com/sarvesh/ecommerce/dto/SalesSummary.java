package com.sarvesh.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesSummary {
    private int year;
    private double totalRevenue;
    private double totalProfit;
    private long totalOrders;
    private List<MonthlySales> monthly;
    private List<Integer> availableYears;
}
