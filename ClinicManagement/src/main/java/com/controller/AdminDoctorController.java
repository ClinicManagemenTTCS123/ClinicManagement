package com.controller;

import com.dao.impl.DepartmentRepository;
import com.dao.impl.DoctorRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.DoctorDto;
import com.model.entity.Department;
import com.model.entity.Doctor;
import com.model.enums.DoctorStatus;
import com.model.mapper.DoctorMapper;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final DoctorRepository doctorRepo = new DoctorRepository();
    private final DepartmentRepository departmentRepo = new DepartmentRepository();

    // Quản lý bác sĩ: xem danh sách, tìm kiếm, lọc
    @GetMapping
    public ResponseEntity<List<DoctorDto>> searchDoctors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) DoctorStatus status) {
        EntityManager em = EntityManagerProvider.em();
        try {
            List<DoctorDto> doctors = doctorRepo.findAll(em).stream()
                    .map(DoctorMapper::toDTO)
                    .filter(dto -> matchesDoctor(dto, keyword, departmentId, status))
                    .sorted(Comparator.comparing(dto -> safe(dto.getFullName())))
                    .toList();
            return ResponseEntity.ok(doctors);
        } finally {
            em.close();
        }
    }

    // Quản lý bác sĩ: xem chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctor(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            Doctor doctor = doctorRepo.findById(em, id);
            if (doctor == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay bac si");
            }
            return ResponseEntity.ok(DoctorMapper.toDTO(doctor));
        } finally {
            em.close();
        }
    }

    // Quản lý bác sĩ: thêm mới
    @PostMapping
    public ResponseEntity<?> createDoctor(@RequestBody DoctorDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            validateDoctorForCreate(em, dto);
            Department department = departmentRepo.findById(em, dto.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khoa"));
            Doctor saved = doctorRepo.save(em, DoctorMapper.toEntity(dto, department));
            em.getTransaction().commit();
            return ResponseEntity.status(HttpStatus.CREATED).body(DoctorMapper.toDTO(saved));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    // Quản lý bác sĩ: cập nhật thông tin
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Integer id, @RequestBody DoctorDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Doctor existing = doctorRepo.findById(em, id);
            if (existing == null) {
                rollback(em);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay bac si");
            }

            validateDoctorForUpdate(em, id, dto, existing);

            if (dto.getDepartmentId() != null) {
                Department department = departmentRepo.findById(em, dto.getDepartmentId())
                        .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khoa"));
                existing.setDepartment(department);
            }
            if (dto.getFullName() != null) existing.setFullName(dto.getFullName());
            if (dto.getGender() != null) existing.setGender(dto.getGender());
            if (dto.getDateOfBirth() != null) existing.setDateOfBirth(dto.getDateOfBirth());
            if (dto.getPhone() != null) existing.setPhone(dto.getPhone());
            if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
            if (dto.getAddress() != null) existing.setAddress(dto.getAddress());
            if (dto.getConsultationFee() != null) existing.setConsultationFee(dto.getConsultationFee());
            if (dto.getDoctorStatus() != null) existing.setStatus(dto.getDoctorStatus());
            if (dto.getNotes() != null) existing.setNotes(dto.getNotes());

            Doctor updated = doctorRepo.update(em, existing);
            em.getTransaction().commit();
            return ResponseEntity.ok(DoctorMapper.toDTO(updated));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    // Quản lý bác sĩ: xóa khi chưa phát sinh dữ liệu liên quan
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Doctor existing = doctorRepo.findById(em, id);
            if (existing == null) {
                rollback(em);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay bac si");
            }
            Long appointmentCount = em.createQuery(
                            "SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId",
                            Long.class
                    )
                    .setParameter("doctorId", id)
                    .getSingleResult();
            Long recordCount = em.createQuery(
                            "SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.doctor.id = :doctorId",
                            Long.class
                    )
                    .setParameter("doctorId", id)
                    .getSingleResult();
            if ((appointmentCount != null && appointmentCount > 0) || (recordCount != null && recordCount > 0)) {
                rollback(em);
                return ResponseEntity.badRequest().body("Khong the xoa bac si da co lich hen hoac ho so benh an");
            }
            em.remove(existing);
            em.getTransaction().commit();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    private void validateDoctorForCreate(EntityManager em, DoctorDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Du lieu bac si rong");
        }
        if (dto.getFullName() == null || dto.getFullName().isBlank()) {
            throw new IllegalArgumentException("Ten bac si khong duoc de trong");
        }
        if (dto.getDepartmentId() == null) {
            throw new IllegalArgumentException("Khoa khong duoc de trong");
        }
        if (dto.getGender() == null) {
            throw new IllegalArgumentException("Gioi tinh khong duoc de trong");
        }
        if (dto.getDateOfBirth() == null) {
            throw new IllegalArgumentException("Ngay sinh khong duoc de trong");
        }
        if (dto.getPhone() == null || dto.getPhone().isBlank()) {
            throw new IllegalArgumentException("So dien thoai khong duoc de trong");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email khong duoc de trong");
        }
        if (dto.getPhone() != null && doctorRepo.existsByPhone(em, dto.getPhone().trim())) {
            throw new IllegalArgumentException("So dien thoai da ton tai");
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank() && doctorRepo.existsByEmail(em, dto.getEmail().trim())) {
            throw new IllegalArgumentException("Email da ton tai");
        }
    }

    private void validateDoctorForUpdate(EntityManager em, Integer id, DoctorDto dto, Doctor existing) {
        if (dto == null) {
            throw new IllegalArgumentException("Du lieu bac si rong");
        }
        if (dto.getDepartmentId() != null && departmentRepo.findById(em, dto.getDepartmentId()).isEmpty()) {
            throw new IllegalArgumentException("Khong tim thay khoa");
        }
        if (dto.getPhone() != null && !dto.getPhone().isBlank() && !dto.getPhone().equals(existing.getPhone())) {
            Doctor duplicatePhone = doctorRepo.findByPhone(em, dto.getPhone().trim());
            if (duplicatePhone != null && !duplicatePhone.getId().equals(id)) {
                throw new IllegalArgumentException("So dien thoai da ton tai");
            }
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank() && !dto.getEmail().equalsIgnoreCase(existing.getEmail())) {
            boolean duplicateEmail = em.createQuery(
                            "SELECT COUNT(d) FROM Doctor d WHERE lower(d.email) = lower(:email) AND d.id <> :id",
                            Long.class
                    )
                    .setParameter("email", dto.getEmail().trim())
                    .setParameter("id", id)
                    .getSingleResult() > 0;
            if (duplicateEmail) {
                throw new IllegalArgumentException("Email da ton tai");
            }
        }
    }

    private boolean matchesDoctor(DoctorDto dto, String keyword, Integer departmentId, DoctorStatus status) {
        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.trim().toLowerCase();
            boolean hit = safe(dto.getFullName()).contains(kw)
                    || safe(dto.getPhone()).contains(kw)
                    || safe(dto.getEmail()).contains(kw);
            if (!hit) {
                return false;
            }
        }
        if (departmentId != null && !departmentId.equals(dto.getDepartmentId())) {
            return false;
        }
        return status == null || status == dto.getDoctorStatus();
    }

    private String safe(String value) {
        return value == null ? "" : value.toLowerCase();
    }

    private void rollback(EntityManager em) {
        if (em.getTransaction().isActive()) {
            em.getTransaction().rollback();
        }
    }
}
