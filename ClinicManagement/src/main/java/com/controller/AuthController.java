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
            // 1. Lấy user từ DB bằng username
            User user = userService.login(request.getUsername(), request.getPassword());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tài khoản hoặc mật khẩu");
            }

            Integer doctorId = null;
            // 2. Nếu là DOCTOR, tìm ID bác sĩ tương ứng (giả định username bên bảng Doctor cũng giống bảng User)
            if (user.getRole() == UserRole.DOCTOR) {
                EntityManager em = EntityManagerProvider.em();
                try {
                    // Bạn có thể tìm bác sĩ theo username hoặc email tùy thiết kế bảng Doctor
                    doctorId = em.createQuery("SELECT d.id FROM Doctor d WHERE d.username = :uname", Integer.class)
                            .setParameter("uname", user.getUsername())
                            .getSingleResult();
                } catch (Exception e) {
                    System.out.println("Chưa có thông tin bác sĩ chi tiết");
                } finally { em.close(); }
            }

            // 3. Trả về thông tin role để Frontend điều hướng
            AuthResponse response = new AuthResponse("Thành công", user.getRole().name(), doctorId);
            return ResponseEntity.ok(response);

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
                return ResponseEntity.ok(new AuthResponse("Đăng ký thành công!", "PATIENT"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đăng ký thất bại.");
            }

        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}