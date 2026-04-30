package com.dao;

import com.model.entity.Invoice;
import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.List;

public interface IInvoiceRepository {
    List<Invoice> findAll(EntityManager em);
    Invoice save(EntityManager em, Invoice invoice);
    List<Invoice> findByCreatedAtBetween(EntityManager em, LocalDateTime from, LocalDateTime to);
    List<Invoice> findByPatientId(EntityManager em, Integer patientId);
    double sumByCreatedAtBetween(EntityManager em, LocalDateTime from, LocalDateTime to);
    double sumUnpaidByPatientId(EntityManager em, Integer patientId);
    long countUnpaidByPatientId(EntityManager em, Integer patientId);
}
