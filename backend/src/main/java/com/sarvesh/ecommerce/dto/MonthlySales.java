package com.sarvesh.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlySales {
    private int month;
    private double revenue;
    private double profit;
    private long orderCount;
}
