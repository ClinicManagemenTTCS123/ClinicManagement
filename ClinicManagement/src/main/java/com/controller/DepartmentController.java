package com.controller;

import com.model.dto.DepartmentDto;
import com.service.IDepartmentService;
import com.service.impl.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final IDepartmentService departmentService = new DepartmentService();

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments(
            @RequestParam(required = false) String search) {
        try {
            return ResponseEntity.ok(departmentService.getAllDepartments(search));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartment(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(departmentService.getDepartment(id));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.createDepartment(dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Integer id, @RequestBody DepartmentDto dto) {
        try {
            return ResponseEntity.ok(departmentService.updateDepartment(id, dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Integer id) {
        try {
            departmentService.deleteDepartment(id);
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