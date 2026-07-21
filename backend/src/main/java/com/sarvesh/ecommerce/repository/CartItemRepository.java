package com.sarvesh.ecommerce.repository;

import com.sarvesh.ecommerce.model.CartItem;
import com.sarvesh.ecommerce.model.Product;
import com.sarvesh.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
}
