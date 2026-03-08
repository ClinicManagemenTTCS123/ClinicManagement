package com.dao;

import com.model.entity.Doctor;
import jakarta.persistence.EntityManager;

import java.util.List;

public interface IDoctorRepository {
    List<Doctor> findAll(EntityManager em);
    Doctor save(EntityManager em,Doctor doctor);
    boolean existsByEmail(EntityManager em,String email);
    boolean existsByPhone(EntityManager em,String phone);
    Doctor findById(EntityManager em, int id);
    Doctor update(EntityManager em,Doctor doctor);
    long countAll(EntityManager em);
    long countByStatus(EntityManager em,
                       com.oop4clinic.clinicmanagement.model.enums.DoctorStatus status);
    Doctor findByPhone(EntityManager em,String phone);
}
