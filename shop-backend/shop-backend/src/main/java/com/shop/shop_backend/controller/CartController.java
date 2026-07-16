package com.shop.shop_backend.controller;

import com.shop.shop_backend.entity.CartItem;
import com.shop.shop_backend.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItem> getCart() {
        return cartService.getAllItems();
    }

    @PostMapping
    public CartItem addToCart(@RequestBody CartItem item) {

        System.out.println("ADD TO CART");
        System.out.println(item);

        return cartService.addItem(item);
    }

    @PutMapping("/{id}/increase")
    public CartItem increase(@PathVariable Long id) {
        return cartService.increaseQuantity(id);
    }

    @PutMapping("/{id}/decrease")
    public CartItem decrease(@PathVariable Long id) {
        return cartService.decreaseQuantity(id);
    }

    @DeleteMapping("/{id}")
    public void removeFromCart(@PathVariable Long id) {
        cartService.deleteItem(id);
    }

}
