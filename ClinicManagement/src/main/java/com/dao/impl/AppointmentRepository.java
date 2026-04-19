package com.dao.impl;

import com.model.entity.Appointment;
import com.model.enums.AppointmentStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AppointmentRepository {
    public Appointment findById(EntityManager em, Integer id) {
        return id == null ? null : em.find(Appointment.class, id);
    }

    public Appointment save(EntityManager em, Appointment appointment) {
        if (appointment.getId() == null) {
            em.persist(appointment);
            return appointment;
        }
        return em.merge(appointment);
    }

    public long countAppointmentsToday(EntityManager em, int doctorId, LocalDate today) {
        Long count = em.createQuery("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :docId AND a.appointment_date = :today", Long.class)
                .setParameter("docId", doctorId)
                .setParameter("today", today)
                .getSingleResult();
        return count != null ? count : 0;
    }

    public long countTotalPatients(EntityManager em, int doctorId) {
        Long count = em.createQuery("SELECT COUNT(DISTINCT a.patient.id) FROM Appointment a WHERE a.doctor.id = :docId", Long.class)
                .setParameter("docId", doctorId)
                .getSingleResult();
        return count != null ? count : 0;
    }

    public long countMedicalRecords(EntityManager em, int doctorId) {
        Long count = em.createQuery("SELECT COUNT(m) FROM MedicalRecord m WHERE m.doctor.id = :docId", Long.class)
                .setParameter("docId", doctorId)
                .getSingleResult();
        return count != null ? count : 0;
    }

    public Appointment getNextAppointment(EntityManager em, int doctorId, LocalDateTime now) {
        try {
            return em.createQuery("SELECT a FROM Appointment a WHERE a.doctor.id = :docId AND a.status = 'CONFIRMED' AND a.startTime > :now ORDER BY a.startTime ASC", Appointment.class)
                    .setParameter("docId", doctorId)
                    .setParameter("now", now)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<Appointment> getUpcomingAppointments(EntityManager em, int doctorId, LocalDateTime now, int limit) {
        return em.createQuery("SELECT a FROM Appointment a WHERE a.doctor.id = :docId AND a.startTime >= :now ORDER BY a.startTime ASC", Appointment.class)
                .setParameter("docId", doctorId)
                .setParameter("now", now)
                .setMaxResults(limit)
                .getResultList();
    }

    public List<Appointment> findUpcoming(EntityManager em, LocalDateTime after, int limit) {
        return em.createQuery(
                        "SELECT a FROM Appointment a " +
                                "JOIN FETCH a.patient p " +
                                "LEFT JOIN FETCH a.doctor d " +
                                "LEFT JOIN FETCH a.department dept " +
                                "WHERE a.startTime > :after ORDER BY a.startTime ASC",
                        Appointment.class
                )
                .setParameter("after", after)
                .setMaxResults(limit)
                .getResultList();
    }

    public long countInRange(EntityManager em, LocalDateTime from, LocalDateTime to) {
        Long count = em.createQuery(
                        "SELECT COUNT(a) FROM Appointment a WHERE a.startTime BETWEEN :from AND :to",
                        Long.class
                )
                .setParameter("from", from)
                .setParameter("to", to)
                .getSingleResult();
        return count == null ? 0 : count;
    }

    public List<Appointment> searchDoctorAppointments(
            EntityManager em, Integer doctorId, String search, String status, LocalDate startDate, LocalDate endDate) {

        StringBuilder hql = new StringBuilder("SELECT a FROM Appointment a WHERE a.doctor.id = :docId");

        if (search != null && !search.trim().isEmpty()) {
            hql.append(" AND LOWER(a.patient.fullName) LIKE LOWER(:search)");
        }
        if (status != null && !status.trim().isEmpty() && !status.equals("ALL")) {
            hql.append(" AND a.status = :status");
        }
        if (startDate != null) {
            hql.append(" AND a.appointment_date >= :startDate");
        }
        if (endDate != null) {
            hql.append(" AND a.appointment_date <= :endDate");
        }
        hql.append(" ORDER BY a.appointment_date DESC, a.startTime DESC");

        TypedQuery<Appointment> query = em.createQuery(hql.toString(), Appointment.class);
        query.setParameter("docId", doctorId);
        if (search != null && !search.trim().isEmpty()) {
            query.setParameter("search", "%" + search.trim() + "%");
        }
        if (status != null && !status.trim().isEmpty() && !status.equals("ALL")) {
            query.setParameter("status", AppointmentStatus.valueOf(status));
        }
        if (startDate != null) query.setParameter("startDate", startDate);
        if (endDate != null) query.setParameter("endDate", endDate);

        return query.getResultList();
    }

    public List<Appointment> findByPatientId(EntityManager em, Integer patientId) {
        return em.createQuery(
                        "SELECT a FROM Appointment a " +
                                "LEFT JOIN FETCH a.doctor d " +
                                "JOIN FETCH a.department dept " +
                                "WHERE a.patient.id = :patientId " +
                                "ORDER BY a.startTime DESC",
                        Appointment.class
                )
                .setParameter("patientId", patientId)
                .getResultList();
    }

    public List<Appointment> findUpcomingByPatientId(EntityManager em, Integer patientId, LocalDateTime now, int limit) {
        return em.createQuery(
                        "SELECT a FROM Appointment a " +
                                "LEFT JOIN FETCH a.doctor d " +
                                "JOIN FETCH a.department dept " +
                                "WHERE a.patient.id = :patientId AND a.startTime >= :now AND a.status <> :canceled " +
                                "ORDER BY a.startTime ASC",
                        Appointment.class
                )
                .setParameter("patientId", patientId)
                .setParameter("now", now)
                .setParameter("canceled", AppointmentStatus.CANCELED)
                .setMaxResults(limit)
                .getResultList();
    }

    public long countUpcomingByPatientId(EntityManager em, Integer patientId, LocalDateTime now) {
        Long count = em.createQuery(
                        "SELECT COUNT(a) FROM Appointment a " +
                                "WHERE a.patient.id = :patientId AND a.startTime >= :now AND a.status <> :canceled",
                        Long.class
                )
                .setParameter("patientId", patientId)
                .setParameter("now", now)
                .setParameter("canceled", AppointmentStatus.CANCELED)
                .getSingleResult();
        return count == null ? 0 : count;
    }

}
