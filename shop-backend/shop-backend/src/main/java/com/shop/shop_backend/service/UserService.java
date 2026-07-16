package com.shop.shop_backend.service;

import com.shop.shop_backend.entity.User;
import com.shop.shop_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public Optional<User> findByMobile(String mobile) {
        return repository.findByMobile(mobile);
    }

    public User save(User user) {
        return repository.save(user);
    }
}
