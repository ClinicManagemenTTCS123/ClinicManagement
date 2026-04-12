package com.dao.impl;

import com.model.entity.MedicalRecord;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MedicalRecordRepository {

    public List<MedicalRecord> searchDoctorMedicalRecords(
            EntityManager em, Integer doctorId, String search, LocalDate startDate, LocalDate endDate) {

        StringBuilder hql = new StringBuilder(
                "SELECT mr FROM MedicalRecord mr " +
                        "JOIN FETCH mr.patient p " +
                        "WHERE mr.doctor.id = :docId"
        );

        if (search != null && !search.trim().isEmpty()) {
            hql.append(" AND LOWER(p.fullName) LIKE LOWER(:search)");
        }
        if (startDate != null) {
            hql.append(" AND mr.createdAt >= :startDateTime");
        }
        if (endDate != null) {
            hql.append(" AND mr.createdAt < :endDateTime");
        }

        hql.append(" ORDER BY mr.createdAt DESC");

        TypedQuery<MedicalRecord> query = em.createQuery(hql.toString(), MedicalRecord.class);
        query.setParameter("docId", doctorId);

        if (search != null && !search.trim().isEmpty()) {
            query.setParameter("search", "%" + search.trim() + "%");
        }
        if (startDate != null) {
            query.setParameter("startDateTime", startDate.atStartOfDay());
        }
        if (endDate != null) {
            query.setParameter("endDateTime", endDate.plusDays(1).atStartOfDay());
        }

        return query.getResultList();
    }
    public MedicalRecord findById(EntityManager em, Integer id) {
        try {
            return em.createQuery("SELECT mr FROM MedicalRecord mr WHERE mr.id = :id", MedicalRecord.class)
                    .setParameter("id", id)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
    public MedicalRecord update(EntityManager em, MedicalRecord record) {
        return em.merge(record);
    }

    public MedicalRecord findByAppointmentId(EntityManager em, Integer appointmentId) {
        try {
            return em.createQuery("SELECT mr FROM MedicalRecord mr WHERE mr.appointment.id = :aptId", MedicalRecord.class)
                    .setParameter("aptId", appointmentId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public void save(EntityManager em, MedicalRecord record) {
        em.persist(record);
    }
}