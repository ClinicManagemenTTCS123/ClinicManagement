package com.controller;

import com.dao.impl.AppointmentRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.AppointmentDto;
import com.model.entity.Appointment;
import com.model.entity.Department;
import com.model.entity.Doctor;
import com.model.entity.Patient;
import com.model.enums.AppointmentStatus;
import com.model.mapper.AppointmentMapper;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/appointments")
public class AdminAppointmentController {
    private final AppointmentRepository appointmentRepo = new AppointmentRepository();

    @GetMapping
    public ResponseEntity<?> getAllAppointments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;

            List<Appointment> list = appointmentRepo.searchAllAppointmentsForAdmin(em, search, status, start, end);
            return ResponseEntity.ok(AppointmentMapper.toDtoList(list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment apt = new Appointment();

            Patient patient = em.find(Patient.class, dto.getPatientId());
            Department dept = em.find(Department.class, dto.getDepartmentId());
            Doctor doctor = dto.getDoctorId() != null ? em.find(Doctor.class, dto.getDoctorId()) : null;

            if (patient == null || dept == null) throw new RuntimeException("Thiếu thông tin bệnh nhân hoặc chuyên khoa");

            apt.setPatient(patient);
            apt.setDepartment(dept);
            apt.setDoctor(doctor);
            apt.setStartTime(dto.getStartTime());
            apt.setAppointment_date(dto.getStartTime().toLocalDate());
            apt.setReason(dto.getReason());
            apt.setStatus(AppointmentStatus.PENDING);

            appointmentRepo.save(em, apt);
            em.getTransaction().commit();
            return ResponseEntity.ok(AppointmentMapper.toDto(apt));
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Integer id, @RequestBody AppointmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment apt = appointmentRepo.findById(em, id);
            if (apt == null) throw new RuntimeException("Không tìm thấy lịch hẹn");

            if (dto.getStatus() != null) apt.setStatus(dto.getStatus());
            if (dto.getReason() != null) apt.setReason(dto.getReason());
            if (dto.getStartTime() != null) {
                apt.setStartTime(dto.getStartTime());
                apt.setAppointment_date(dto.getStartTime().toLocalDate());
            }
            if (dto.getDoctorId() != null) {
                apt.setDoctor(em.find(Doctor.class, dto.getDoctorId()));
            }

            appointmentRepo.save(em, apt);
            em.getTransaction().commit();
            return ResponseEntity.ok(AppointmentMapper.toDto(apt));
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment apt = appointmentRepo.findById(em, id);
            if (apt != null) em.remove(apt);
            em.getTransaction().commit();
            return ResponseEntity.ok("Đã xóa thành công");
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }
}