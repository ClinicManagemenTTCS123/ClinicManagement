package com.dao.impl;

import com.dao.IInvoiceRepository;
import com.model.entity.Invoice;
import com.model.enums.InvoiceStatus;
import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.List;

public class InvoiceRepository implements IInvoiceRepository {
    @Override
    public List<Invoice> findAll(EntityManager em) {
        return em.createQuery(
                        "SELECT i FROM Invoice i " +
                                "JOIN FETCH i.patient p " +
                                "JOIN FETCH i.appointment a " +
                                "ORDER BY i.createdAt DESC",
                        Invoice.class
                )
                .getResultList();
    }

    @Override
    public Invoice save(EntityManager em, Invoice invoice) {
        if (invoice.getId() == null) {
            em.persist(invoice);
            return invoice;
        }
        return em.merge(invoice);
    }

    @Override
    public List<Invoice> findByCreatedAtBetween(EntityManager em, LocalDateTime from, LocalDateTime to) {
        return em.createQuery(
                        "SELECT i FROM Invoice i " +
                                "JOIN FETCH i.patient p " +
                                "JOIN FETCH i.appointment a " +
                                "WHERE i.createdAt BETWEEN :from AND :to " +
                                "ORDER BY i.createdAt ASC",
                        Invoice.class
                )
                .setParameter("from", from)
                .setParameter("to", to)
                .getResultList();
    }

    @Override
    public List<Invoice> findByPatientId(EntityManager em, Integer patientId) {
        return em.createQuery(
                        "SELECT i FROM Invoice i " +
                                "JOIN FETCH i.patient p " +
                                "JOIN FETCH i.appointment a " +
                                "LEFT JOIN FETCH a.doctor d " +
                                "LEFT JOIN FETCH a.department dept " +
                                "WHERE p.id = :patientId " +
                                "ORDER BY i.createdAt DESC",
                        Invoice.class
                )
                .setParameter("patientId", patientId)
                .getResultList();
    }

    @Override
    public double sumByCreatedAtBetween(EntityManager em, LocalDateTime from, LocalDateTime to) {
        Double sum = em.createQuery(
                        "SELECT SUM(i.total) FROM Invoice i WHERE i.createdAt BETWEEN :from AND :to",
                        Double.class
                )
                .setParameter("from", from)
                .setParameter("to", to)
                .getSingleResult();
        return sum == null ? 0.0 : sum;
    }

    @Override
    public double sumUnpaidByPatientId(EntityManager em, Integer patientId) {
        Double sum = em.createQuery(
                        "SELECT SUM(i.total) FROM Invoice i WHERE i.patient.id = :patientId AND i.status = :status",
                        Double.class
                )
                .setParameter("patientId", patientId)
                .setParameter("status", InvoiceStatus.UNPAID)
                .getSingleResult();
        return sum == null ? 0.0 : sum;
    }

    @Override
    public long countUnpaidByPatientId(EntityManager em, Integer patientId) {
        Long count = em.createQuery(
                        "SELECT COUNT(i) FROM Invoice i WHERE i.patient.id = :patientId AND i.status = :status",
                        Long.class
                )
                .setParameter("patientId", patientId)
                .setParameter("status", InvoiceStatus.UNPAID)
                .getSingleResult();
        return count == null ? 0 : count;
    }
}
