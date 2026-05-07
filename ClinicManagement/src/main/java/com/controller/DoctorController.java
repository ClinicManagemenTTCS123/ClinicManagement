package com.controller;

import com.dao.jpa.EntityManagerProvider;
import com.model.dto.*;
import com.model.entity.Appointment;
import com.model.enums.AppointmentStatus;
import com.service.IDoctorService;
import com.service.impl.DoctorService;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final IDoctorService doctorService = new DoctorService();

    // Dashboard của bác sĩ
    @GetMapping("/{doctorId}/dashboard")
    public ResponseEntity<?> getDashboardStats(@PathVariable Integer doctorId) {
        try {
            return ResponseEntity.ok(doctorService.getDashboardStats(doctorId));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    // Lịch hẹn của bác sĩ: xem, tìm kiếm, lọc
    @GetMapping("/{doctorId}/appointments")
    public ResponseEntity<?> getAppointments(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            return ResponseEntity.ok(doctorService.getAppointments(doctorId, search, status, startDate, endDate));
        } catch (Exception e) {
            return handleException(e, "Lỗi khi tải lịch hẹn: ");
        }
    }

    // Bệnh nhân của bác sĩ: tìm kiếm, xem
    @GetMapping("/{doctorId}/patients")
    public ResponseEntity<?> getPatientsByDoctor(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) String search) {
        try {
            return ResponseEntity.ok(doctorService.getPatientsByDoctor(doctorId, search));
        } catch (Exception e) {
            return handleException(e, "Lỗi khi tải bệnh nhân: ");
        }
    }

    // Hồ sơ bệnh án của bác sĩ: tìm kiếm, xem
    @GetMapping("/{doctorId}/medical-records")
    public ResponseEntity<?> getMedicalRecords(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            return ResponseEntity.ok(doctorService.getMedicalRecords(doctorId, search, startDate, endDate));
        } catch (Exception e) {
            return handleException(e, "Lỗi khi tải hồ sơ bệnh án: ");
        }
    }

    // Hồ sơ cá nhân bác sĩ: xem
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorProfile(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(doctorService.getDoctorProfile(id));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    // Hồ sơ cá nhân bác sĩ: sửa, lưu
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctorProfile(@PathVariable Integer id, @RequestBody DoctorDto dto) {
        try {
            return ResponseEntity.ok(doctorService.updateDoctorProfile(id, dto));
        } catch (Exception e) {
            return handleException(e, "Lỗi cập nhật: ");
        }
    }

    private ResponseEntity<?> handleException(Exception e) {
        return handleException(e, "");
    }

    private ResponseEntity<?> handleException(Exception e, String prefix) {
        String msg = e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống";
        if (msg.toLowerCase().contains("không tìm thấy")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(prefix + msg);
        }
        return ResponseEntity.badRequest().body(prefix + msg);
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Integer id,
            @RequestParam AppointmentStatus status) {

        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment apt = em.find(Appointment.class, id);
            if (apt == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy lịch hẹn");
            }
            apt.setStatus(status);
            em.merge(apt);
            em.getTransaction().commit();
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        } finally {
            em.close();
        }
    }
}