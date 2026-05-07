package com.controller;

import com.model.dto.DoctorDto;
import com.model.enums.DoctorStatus;
import com.service.IAdminDoctorService;
import com.service.impl.AdminDoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final IAdminDoctorService adminDoctorService = new AdminDoctorService();

    @GetMapping
    public ResponseEntity<List<DoctorDto>> searchDoctors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) DoctorStatus status) {
        try {
            return ResponseEntity.ok(adminDoctorService.searchDoctors(keyword, departmentId, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctor(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(adminDoctorService.getDoctor(id));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping
    public ResponseEntity<?> createDoctor(@RequestBody DoctorDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(adminDoctorService.createDoctor(dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Integer id, @RequestBody DoctorDto dto) {
        try {
            return ResponseEntity.ok(adminDoctorService.updateDoctor(id, dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Integer id) {
        try {
            adminDoctorService.deleteDoctor(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return handleException(e);
        }
    }

    // --- Hàm tiện ích xử lý Exception thống nhất HTTP Status Code ---
    private ResponseEntity<?> handleException(Exception e) {
        String msg = e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống";
        if (msg.toLowerCase().contains("khong tim thay") || msg.toLowerCase().contains("không tìm thấy")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }
        return ResponseEntity.badRequest().body(msg);
    }
}