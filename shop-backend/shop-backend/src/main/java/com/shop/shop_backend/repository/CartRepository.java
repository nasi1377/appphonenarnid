package com.shop.shop_backend.repository;

import com.shop.shop_backend.entity.CartItem;
import com.shop.shop_backend.entity.Product;
import com.shop.shop_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByIdAndUser(Long id, User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

}
