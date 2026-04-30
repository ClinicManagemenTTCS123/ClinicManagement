package com.controller;

import com.dao.impl.DepartmentRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.DepartmentDto;
import com.model.entity.Department;
import com.model.mapper.DepartmentMapper;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepo = new DepartmentRepository();

    // Quản lý khoa: xem danh sách, tìm kiếm
    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments(
            @RequestParam(required = false) String search) {
        EntityManager em = EntityManagerProvider.em();
        try {
            List<DepartmentDto> departments = DepartmentMapper.toDtoList(departmentRepo.findAll(em)).stream()
                    .filter(dto -> {
                        if (search == null || search.isBlank()) {
                            return true;
                        }
                        String keyword = search.trim().toLowerCase();
                        return safe(dto.getName()).contains(keyword)
                                || safe(dto.getDescription()).contains(keyword);
                    })
                    .sorted(Comparator.comparing(dto -> safe(dto.getName())))
                    .toList();
            return ResponseEntity.ok(departments);
        } finally {
            em.close();
        }
    }

    // Quản lý khoa: xem chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartment(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            return departmentRepo.findById(em, id)
                    .<ResponseEntity<?>>map(department -> ResponseEntity.ok(DepartmentMapper.toDto(department)))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay khoa"));
        } finally {
            em.close();
        }
    }

    // Quản lý khoa: thêm mới
    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            if (dto == null || dto.getName() == null || dto.getName().isBlank()) {
                throw new IllegalArgumentException("Ten khoa khong duoc de trong");
            }
            if (dto.getBaseFee() == null) {
                throw new IllegalArgumentException("Base fee khong duoc de trong");
            }
            Department saved = departmentRepo.create(em, DepartmentMapper.toEntity(dto));
            em.getTransaction().commit();
            return ResponseEntity.status(HttpStatus.CREATED).body(DepartmentMapper.toDto(saved));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    // Quản lý khoa: cập nhật thông tin
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Integer id, @RequestBody DepartmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Department department = departmentRepo.findById(em, id).orElse(null);
            if (department == null) {
                rollback(em);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay khoa");
            }
            if (dto == null || dto.getName() == null || dto.getName().isBlank()) {
                throw new IllegalArgumentException("Ten khoa khong duoc de trong");
            }
            if (dto.getBaseFee() == null) {
                throw new IllegalArgumentException("Base fee khong duoc de trong");
            }
            DepartmentMapper.applyToEntity(dto, department);
            Department updated = departmentRepo.update(em, department);
            em.getTransaction().commit();
            return ResponseEntity.ok(DepartmentMapper.toDto(updated));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    // Quản lý khoa: xóa khi chưa có dữ liệu liên quan
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Department department = departmentRepo.findById(em, id).orElse(null);
            if (department == null) {
                rollback(em);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay khoa");
            }
            if (department.getDoctors() != null && !department.getDoctors().isEmpty()) {
                rollback(em);
                return ResponseEntity.badRequest().body("Khong the xoa khoa con bac si");
            }
            Long appointmentCount = em.createQuery(
                            "SELECT COUNT(a) FROM Appointment a WHERE a.department.id = :departmentId",
                            Long.class
                    )
                    .setParameter("departmentId", id)
                    .getSingleResult();
            if (appointmentCount != null && appointmentCount > 0) {
                rollback(em);
                return ResponseEntity.badRequest().body("Khong the xoa khoa da co lich hen");
            }
            departmentRepo.deleteById(em, id);
            em.getTransaction().commit();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    private void rollback(EntityManager em) {
        if (em.getTransaction().isActive()) {
            em.getTransaction().rollback();
        }
    }

    private String safe(String value) {
        return value == null ? "" : value.toLowerCase();
    }
}
