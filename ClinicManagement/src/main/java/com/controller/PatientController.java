package com.controller;

import com.model.dto.*;
import com.service.IPatientService;
import com.service.impl.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final IPatientService patientService = new PatientService();

    @GetMapping
    public ResponseEntity<List<PatientDto>> getPatients(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String phone) {
        return ResponseEntity.ok(patientService.getPatients(search, phone));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatient(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(patientService.getPatient(id));
        } catch (IllegalArgumentException e) {
            return handleException(e);
        }
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<?> getPatientDashboard(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(patientService.getPatientDashboard(id));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/{id}/appointments")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(patientService.getPatientAppointments(id));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/{id}/appointments")
    public ResponseEntity<?> createPatientAppointment(@PathVariable Integer id, @RequestBody AppointmentDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(patientService.createPatientAppointment(id, dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{patientId}/appointments/{appointmentId}/cancel")
    public ResponseEntity<?> cancelPatientAppointment(@PathVariable Integer patientId, @PathVariable Integer appointmentId) {
        try {
            return ResponseEntity.ok(patientService.cancelPatientAppointment(patientId, appointmentId));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/{id}/medical-records")
    public ResponseEntity<?> getPatientMedicalRecords(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(patientService.getPatientMedicalRecords(id));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/{id}/invoices")
    public ResponseEntity<?> getPatientInvoices(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(patientService.getPatientInvoices(id));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody PatientDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createPatient(dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Integer id, @RequestBody PatientDto dto) {
        try {
            return ResponseEntity.ok(patientService.updatePatient(id, dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Integer id) {
        try {
            patientService.deletePatient(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{patientId}/appointments/{appointmentId}")
    public ResponseEntity<?> updatePatientAppointment(
            @PathVariable Integer patientId,
            @PathVariable Integer appointmentId,
            @RequestBody AppointmentDto dto) {
        try {
            return ResponseEntity.ok(patientService.updatePatientAppointment(patientId, appointmentId, dto));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/{patientId}/invoices/{invoiceId}/pay")
    public ResponseEntity<?> payInvoice(@PathVariable Integer patientId, @PathVariable Integer invoiceId) {
        try {
            patientService.payInvoice(patientId, invoiceId);
            return ResponseEntity.ok("Thanh toán thành công");
        } catch (Exception e) {
            return handleException(e);
        }
    }

    private ResponseEntity<?> handleException(Exception e) {
        String msg = e.getMessage() != null ? e.getMessage() : "";
        if (msg.toLowerCase().contains("khong tim thay") || msg.toLowerCase().contains("không tìm thấy")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }
        return ResponseEntity.badRequest().body(msg);
    }
}