package com.shop.shop_backend.service;

import com.shop.shop_backend.entity.Product;
import com.shop.shop_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // دریافت همه محصولات
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // دریافت محصول بر اساس ID
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // ذخیره محصول
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // حذف محصول
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
