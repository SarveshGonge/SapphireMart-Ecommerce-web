package com.sarvesh.ecommerce.service;

import com.sarvesh.ecommerce.dto.ProductRequest;
import com.sarvesh.ecommerce.exception.ApiException;
import com.sarvesh.ecommerce.model.Product;
import com.sarvesh.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> getProducts(String category, String search, Pageable pageable) {
        boolean hasCategory = StringUtils.hasText(category);
        boolean hasSearch = StringUtils.hasText(search);

        if (hasCategory && hasSearch) {
            return productRepository.findByCategoryIgnoreCaseAndNameContainingIgnoreCase(category, search, pageable);
        } else if (hasCategory) {
            return productRepository.findByCategoryIgnoreCase(category, pageable);
        } else if (hasSearch) {
            return productRepository.findByNameContainingIgnoreCase(search, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));
    }

    public Product create(ProductRequest req) {
        Product product = Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .costPrice(req.getCostPrice())
                .category(req.getCategory())
                .imageUrl(req.getImageUrl())
                .stock(req.getStock())
                .build();
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest req) {
        Product product = getById(id);
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setCostPrice(req.getCostPrice());
        product.setCategory(req.getCategory());
        product.setImageUrl(req.getImageUrl());
        product.setStock(req.getStock());
        return productRepository.save(product);
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ApiException("Product not found", HttpStatus.NOT_FOUND);
        }
        productRepository.deleteById(id);
    }
}
