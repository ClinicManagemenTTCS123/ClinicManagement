package com.dao;

import com.model.entity.Department;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;

public interface IDepartmentRepository {
    List<Department> findAll(EntityManager em);
    Optional<Department> findById(EntityManager em, Integer id);
    Department create(EntityManager em, Department department);
    Department update(EntityManager em, Department department);
    void deleteById(EntityManager em, Integer id);
}
