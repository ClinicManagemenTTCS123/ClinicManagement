package com.controller;

import com.model.dto.AppointmentDto;
import com.service.IAdminAppointmentService;
import com.service.impl.AdminAppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/appointments")
public class AdminAppointmentController {

    private final IAdminAppointmentService adminAppointmentService = new AdminAppointmentService();

    @GetMapping
    public ResponseEntity<?> getAllAppointments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            return ResponseEntity.ok(adminAppointmentService.getAllAppointments(search, status, startDate, endDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải lịch hẹn: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(adminAppointmentService.createAppointment(dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Integer id, @RequestBody AppointmentDto dto) {
        try {
            return ResponseEntity.ok(adminAppointmentService.updateAppointment(id, dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Integer id) {
        try {
            adminAppointmentService.deleteAppointment(id);
            return ResponseEntity.ok("Đã xóa thành công");
        } catch (Exception e) {
            return handleException(e);
        }
    }

    // --- Hàm tiện ích xử lý Exception thống nhất HTTP Status Code ---
    private ResponseEntity<?> handleException(Exception e) {
        String msg = e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống";
        if (msg.toLowerCase().contains("không tìm thấy")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }
        return ResponseEntity.badRequest().body(msg);
    }
}