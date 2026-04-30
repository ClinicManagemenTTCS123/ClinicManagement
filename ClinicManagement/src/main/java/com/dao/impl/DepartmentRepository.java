package com.dao.impl;

import com.dao.IDepartmentRepository;
import com.model.entity.Department;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;

public class DepartmentRepository implements IDepartmentRepository {
    @Override
    public List<Department> findAll(EntityManager em) {
        // Phục vụ quản lý khoa: lấy danh sách khoa kèm bác sĩ thuộc khoa
        return em.createQuery(
                "SELECT d FROM Department d LEFT JOIN FETCH d.doctors ORDER BY d.id",
                Department.class
        ).getResultList();
    }

    @Override
    public Optional<Department> findById(EntityManager em, Integer id) {
        if (id == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(em.find(Department.class, id));
    }

    @Override
    public Department create(EntityManager em, Department department) {
        if (department.getId() == null) {
            em.persist(department);
            return department;
        }
        return em.merge(department);
    }

    @Override
    public Department update(EntityManager em, Department department) {
        if (department == null || department.getId() == null) {
            throw new IllegalArgumentException("Department hoac id rong");
        }
        return em.merge(department);
    }

    @Override
    public void deleteById(EntityManager em, Integer id) {
        Department department = em.find(Department.class, id);
        if (department != null) {
            em.remove(department);
        }
    }
}
