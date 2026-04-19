package com.dao.impl;

import com.model.entity.Patient;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

public class PatientRepository {

    public Optional<Patient> findById(EntityManager em, Integer id) {
        if (id == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(em.find(Patient.class, id));
    }

    public Patient create(EntityManager em, Patient patient) {
        if (patient.getId() == null) {
            em.persist(patient);
            return patient;
        }
        return em.merge(patient);
    }

    public Patient update(EntityManager em, Patient patient) {
        if (patient == null || patient.getId() == null) {
            throw new IllegalArgumentException("Patient hoac id rong");
        }
        return em.merge(patient);
    }

    public List<Patient> findAll(EntityManager em) {
        // Phục vụ quản lý bệnh nhân: lấy toàn bộ danh sách bệnh nhân
        return em.createQuery(
                "SELECT p FROM Patient p ORDER BY p.id DESC",
                Patient.class
        ).getResultList();
    }

    public long countAll(EntityManager em) {
        Long count = em.createQuery("SELECT COUNT(p) FROM Patient p", Long.class)
                .getSingleResult();
        return count == null ? 0 : count;
    }

    public List<Patient> findNewest(EntityManager em, int limit) {
        // Phục vụ dashboard: lấy bệnh nhân mới nhất
        return em.createQuery(
                        "SELECT p FROM Patient p ORDER BY p.id DESC",
                        Patient.class
                )
                .setMaxResults(limit)
                .getResultList();
    }

    public Optional<Patient> findByPhone(EntityManager em, String phone) {
        try {
            Patient patient = em.createQuery(
                            "SELECT p FROM Patient p WHERE p.phone = :phone",
                            Patient.class
                    )
                    .setParameter("phone", phone)
                    .getSingleResult();
            return Optional.of(patient);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    public void deleteById(EntityManager em, Integer id) {
        Patient patient = em.find(Patient.class, id);
        if (patient != null) {
            em.remove(patient);
        }
    }

    public List<Patient> getPatientsByDoctorId(EntityManager em, Integer doctorId, String search) {
        // Phục vụ bác sĩ: tìm kiếm và xem danh sách bệnh nhân theo bác sĩ
        StringBuilder hql = new StringBuilder(
                "SELECT DISTINCT p FROM Patient p " +
                        "JOIN p.appointments a " +
                        "LEFT JOIN FETCH p.medicalRecords mr " +
                        "WHERE a.doctor.id = :docId"
        );

        if (search != null && !search.trim().isEmpty()) {
            hql.append(" AND (LOWER(p.fullName) LIKE LOWER(:search) OR p.phone LIKE :search)");
        }

        hql.append(" ORDER BY p.fullName ASC");

        TypedQuery<Patient> query = em.createQuery(hql.toString(), Patient.class);
        query.setParameter("docId", doctorId);

        if (search != null && !search.trim().isEmpty()) {
            query.setParameter("search", "%" + search.trim() + "%");
        }

        return query.getResultList();
    }
}
