package com.service.impl;

import com.dao.impl.DepartmentRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.DepartmentDto;
import com.model.entity.Department;
import com.model.mapper.DepartmentMapper;
import com.service.IDepartmentService;
import jakarta.persistence.EntityManager;

import java.util.Comparator;
import java.util.List;

public class DepartmentService implements IDepartmentService {

    private final DepartmentRepository departmentRepo = new DepartmentRepository();

    @Override
    public List<DepartmentDto> getAllDepartments(String search) {
        EntityManager em = EntityManagerProvider.em();
        try {
            return DepartmentMapper.toDtoList(departmentRepo.findAll(em)).stream()
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
        } finally {
            em.close();
        }
    }

    @Override
    public DepartmentDto getDepartment(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            Department department = departmentRepo.findById(em, id)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khoa"));
            return DepartmentMapper.toDto(department);
        } finally {
            em.close();
        }
    }

    @Override
    public DepartmentDto createDepartment(DepartmentDto dto) {
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
            return DepartmentMapper.toDto(saved);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public DepartmentDto updateDepartment(Integer id, DepartmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Department department = departmentRepo.findById(em, id)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khoa"));

            if (dto == null || dto.getName() == null || dto.getName().isBlank()) {
                throw new IllegalArgumentException("Ten khoa khong duoc de trong");
            }
            if (dto.getBaseFee() == null) {
                throw new IllegalArgumentException("Base fee khong duoc de trong");
            }

            DepartmentMapper.applyToEntity(dto, department);
            Department updated = departmentRepo.update(em, department);

            em.getTransaction().commit();
            return DepartmentMapper.toDto(updated);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public void deleteDepartment(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Department department = departmentRepo.findById(em, id)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khoa"));

            if (department.getDoctors() != null && !department.getDoctors().isEmpty()) {
                throw new IllegalArgumentException("Khong the xoa khoa con bac si");
            }

            Long appointmentCount = em.createQuery(
                            "SELECT COUNT(a) FROM Appointment a WHERE a.department.id = :departmentId",
                            Long.class
                    )
                    .setParameter("departmentId", id)
                    .getSingleResult();

            if (appointmentCount != null && appointmentCount > 0) {
                throw new IllegalArgumentException("Khong the xoa khoa da co lich hen");
            }

            departmentRepo.deleteById(em, id);

            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    private String safe(String value) {
        return value == null ? "" : value.toLowerCase();
    }
}