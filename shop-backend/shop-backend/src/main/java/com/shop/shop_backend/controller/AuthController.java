package com.shop.shop_backend.controller;

import com.shop.shop_backend.dto.LoginRequest;
import com.shop.shop_backend.entity.User;
import com.shop.shop_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.shop.shop_backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository
                .findByMobile(request.getMobile())
                .orElseThrow(() -> new RuntimeException("کاربر پیدا نشد"));

        boolean ok = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!ok) {
            throw new RuntimeException("رمز عبور اشتباه است");
        }

        // ساخت توکن
        String token = JwtUtil.generateToken(user.getMobile());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    }

