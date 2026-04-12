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
    private final DoctorRepository doctorRepo = new DoctorRepository();
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            Integer doctorId = null;

            if (user.getRole() == UserRole.DOCTOR) {
                EntityManager em = EntityManagerProvider.em();
                try {
                    doctorId = em.createQuery("SELECT d.id FROM Doctor d WHERE d.email = :email", Integer.class)
                            .setParameter("email", user.getUsername())
                            .getSingleResult();

                } catch (Exception e) {
                    System.out.println("Lỗi khi tìm Bác sĩ: " + e.getMessage());
                    e.printStackTrace();
                } finally {
                    em.close();
                }
            }
            AuthResponse response = new AuthResponse("Đăng nhập thành công!", user.getRole().name(), doctorId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
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
                return ResponseEntity.ok(new AuthResponse("Đăng ký thành công!", "PATIENT"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đăng ký thất bại.");
            }

        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}