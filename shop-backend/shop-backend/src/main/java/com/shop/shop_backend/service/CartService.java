package com.shop.shop_backend.service;

import com.shop.shop_backend.entity.CartItem;

import java.util.List;

public interface CartService {

    List<CartItem> getAllItems();

    CartItem addItem(CartItem item);

    void deleteItem(Long id);

    CartItem increaseQuantity(Long id);

    CartItem decreaseQuantity(Long id);

}
