package com.dao.impl;

import com.model.entity.Patient;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class PatientRepository {

    public List<Patient> getPatientsByDoctorId(EntityManager em, Integer doctorId, String search) {
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