package com.controller;

import com.model.dto.MedicalRecordDto;
import com.service.IMedicalRecordService;
import com.service.impl.MedicalRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final IMedicalRecordService medicalRecordService = new MedicalRecordService();

    @GetMapping
    public ResponseEntity<?> getAllMedicalRecords(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            return ResponseEntity.ok(medicalRecordService.getAllMedicalRecords(search, startDate, endDate));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicalRecordById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(medicalRecordService.getMedicalRecordById(id));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getByAppointmentId(@PathVariable Integer appointmentId) {
        try {
            return ResponseEntity.ok(medicalRecordService.getMedicalRecordByAppointmentId(appointmentId));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping
    public ResponseEntity<?> createMedicalRecord(@RequestBody MedicalRecordDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(medicalRecordService.createMedicalRecord(dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicalRecord(@PathVariable Integer id, @RequestBody MedicalRecordDto dto) {
        try {
            return ResponseEntity.ok(medicalRecordService.updateMedicalRecord(id, dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicalRecord(@PathVariable Integer id) {
        try {
            medicalRecordService.deleteMedicalRecord(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return handleException(e);
        }
    }

    private ResponseEntity<?> handleException(Exception e) {
        String msg = e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống";
        if (msg.toLowerCase().contains("không tìm thấy")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }
        return ResponseEntity.badRequest().body(msg);
    }
}