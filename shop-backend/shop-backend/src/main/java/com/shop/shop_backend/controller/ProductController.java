package com.shop.shop_backend.controller;

import com.shop.shop_backend.entity.Product;
import com.shop.shop_backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    // Constructor Injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // دریافت همه محصولات
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // دریافت یک محصول با ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // ایجاد محصول جدید
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    // ویرایش محصول
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestBody Product product) {

        Product existingProduct = productService.getProductById(id);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());

        return productService.saveProduct(existingProduct);
    }

    // حذف محصول
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}
