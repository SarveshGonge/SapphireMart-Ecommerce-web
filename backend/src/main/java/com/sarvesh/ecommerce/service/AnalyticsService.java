package com.sarvesh.ecommerce.service;

import com.sarvesh.ecommerce.dto.MonthlySales;
import com.sarvesh.ecommerce.dto.SalesSummary;
import com.sarvesh.ecommerce.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderItemRepository orderItemRepository;

    public SalesSummary getSalesSummary(Integer requestedYear) {
        List<Integer> availableYears = orderItemRepository.findDistinctOrderYears().stream()
                .map(Number::intValue)
                .sorted(Comparator.reverseOrder())
                .collect(Collectors.toList());

        int year = requestedYear != null ? requestedYear
                : (!availableYears.isEmpty() ? availableYears.get(0) : Year.now().getValue());

        List<Object[]> rows = orderItemRepository.findMonthlySales(year);

        List<MonthlySales> monthly = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            monthly.add(new MonthlySales(m, 0.0, 0.0, 0L));
        }
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            double revenue = ((Number) row[1]).doubleValue();
            double profit = ((Number) row[2]).doubleValue();
            long orderCount = ((Number) row[3]).longValue();
            monthly.set(month - 1, new MonthlySales(month, revenue, profit, orderCount));
        }

        double totalRevenue = monthly.stream().mapToDouble(MonthlySales::getRevenue).sum();
        double totalProfit = monthly.stream().mapToDouble(MonthlySales::getProfit).sum();
        long totalOrders = monthly.stream().mapToLong(MonthlySales::getOrderCount).sum();

        if (availableYears.isEmpty()) {
            availableYears = List.of(Year.now().getValue());
        }

        return new SalesSummary(year, round2(totalRevenue), round2(totalProfit), totalOrders, monthly, availableYears);
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
