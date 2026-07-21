package com.sarvesh.ecommerce.repository;

import com.sarvesh.ecommerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
            SELECT extract(month from o.createdAt) as month,
                   COALESCE(SUM(oi.priceAtPurchase * oi.quantity), 0) as revenue,
                   COALESCE(SUM((oi.priceAtPurchase - oi.product.costPrice) * oi.quantity), 0) as profit,
                   COUNT(DISTINCT o.id) as orderCount
            FROM OrderItem oi JOIN oi.order o
            WHERE extract(year from o.createdAt) = :year
              AND o.status <> com.sarvesh.ecommerce.model.OrderStatus.CANCELLED
            GROUP BY extract(month from o.createdAt)
            ORDER BY extract(month from o.createdAt)
            """)
    List<Object[]> findMonthlySales(@Param("year") int year);

    @Query("""
            SELECT DISTINCT extract(year from o.createdAt) as yr
            FROM Order o
            ORDER BY yr DESC
            """)
    List<Number> findDistinctOrderYears();
}
