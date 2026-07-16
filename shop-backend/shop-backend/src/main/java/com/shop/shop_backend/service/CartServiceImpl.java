package com.shop.shop_backend.service;

import com.shop.shop_backend.entity.CartItem;
import com.shop.shop_backend.entity.User;
import com.shop.shop_backend.repository.CartRepository;
import com.shop.shop_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String mobile = authentication.getName();

        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<CartItem> getAllItems() {

        return cartRepository.findByUser(getCurrentUser());

    }

    @Override
    public CartItem addItem(CartItem item) {

        User user = getCurrentUser();

        Optional<CartItem> oldItem =
                cartRepository.findByUserAndProduct(user, item.getProduct());

        if (oldItem.isPresent()) {

            CartItem cartItem = oldItem.get();

            cartItem.setQuantity(
                    cartItem.getQuantity() + item.getQuantity()
            );

            return cartRepository.save(cartItem);
        }

        item.setUser(user);

        return cartRepository.save(item);

    }

    @Override
    public CartItem increaseQuantity(Long id) {

        CartItem item = cartRepository
                .findByIdAndUser(id, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Cart Item Not Found"));

        item.setQuantity(item.getQuantity() + 1);

        return cartRepository.save(item);
    }

    @Override
    public CartItem decreaseQuantity(Long id) {

        CartItem item = cartRepository
                .findByIdAndUser(id, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Cart Item Not Found"));

        if (item.getQuantity() > 1) {

            item.setQuantity(item.getQuantity() - 1);

            return cartRepository.save(item);

        }

        cartRepository.delete(item);

        return item;
    }

    @Override
    public void deleteItem(Long id) {

        CartItem item = cartRepository
                .findByIdAndUser(id, getCurrentUser())
                .orElseThrow(() -> new RuntimeException("Cart Item Not Found"));

        cartRepository.delete(item);

    }

}
