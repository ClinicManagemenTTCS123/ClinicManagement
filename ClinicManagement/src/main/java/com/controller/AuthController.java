package com.controller;

import com.dao.impl.DoctorRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.AuthResponse;
import com.model.dto.LoginRequest;
import com.model.dto.RegisterRequest;
import com.model.entity.User;
import com.model.enums.UserRole;
import com.service.impl.UserService;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService = new UserService();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getUsername(), request.getPassword());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tài khoản hoặc mật khẩu");
            }

            Integer doctorId = null;
            Integer patientId = null;

            EntityManager em = EntityManagerProvider.em();
            try {
                if (user.getRole() == UserRole.DOCTOR) {
                    try {
                        doctorId = em.createQuery("SELECT d.id FROM Doctor d WHERE d.username = :uname", Integer.class)
                                .setParameter("uname", user.getUsername())
                                .getSingleResult();
                    } catch (Exception e) {
                        System.out.println("Không tìm thấy hồ sơ bác sĩ chi tiết");
                    }
                }
                else if (user.getRole() == UserRole.PATIENT) {
                    try {
                        patientId = em.createQuery("SELECT p.id FROM Patient p WHERE p.username = :uname", Integer.class)
                                .setParameter("uname", user.getUsername())
                                .getSingleResult();
                    } catch (Exception e) {
                        System.out.println("Không tìm thấy hồ sơ bệnh nhân chi tiết");
                    }
                }
            } finally {
                em.close();
            }

            // Gọi đúng constructor 4 tham số: String, String, Integer, Integer
            return ResponseEntity.ok(new AuthResponse("Thành công", user.getRole().name(), doctorId, patientId));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            boolean isSuccess = userService.register(
                    request.getEmail(),
                    request.getPassword(),
                    request.getConfirmPassword()
            );

            if (isSuccess) {
                // SỬA TẠI ĐÂY: Truyền đủ 4 tham số để khớp với file AuthResponse.java
                return ResponseEntity.ok(new AuthResponse("Đăng ký thành công!", "PATIENT", null, null));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đăng ký thất bại.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}