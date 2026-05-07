package com.service.impl;

import com.dao.impl.InvoiceRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.InvoiceDto;
import com.model.entity.Invoice;
import com.model.enums.InvoiceStatus;
import com.model.mapper.InvoiceMapper;
import com.service.IInvoiceService;
import jakarta.persistence.EntityManager;

import java.util.List;

public class InvoiceService implements IInvoiceService {

    private final InvoiceRepository invoiceRepo = new InvoiceRepository();
    private final InvoiceMapper invoiceMapper = new InvoiceMapper();

    @Override
    public List<InvoiceDto> getAllInvoices() {
        EntityManager em = EntityManagerProvider.em();
        try {
            List<Invoice> invoices = invoiceRepo.findAll(em);
            return invoiceMapper.toDtoList(invoices);
        } finally {
            em.close();
        }
    }

    @Override
    public void updateInvoiceStatus(Integer id, InvoiceStatus status) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Invoice invoice = em.find(Invoice.class, id);
            if (invoice == null) {
                throw new IllegalArgumentException("Không tìm thấy hóa đơn");
            }

            invoice.setStatus(status);
            invoiceRepo.save(em, invoice);

            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public void deleteInvoice(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Invoice invoice = em.find(Invoice.class, id);
            if (invoice == null) {
                throw new IllegalArgumentException("Không tìm thấy hóa đơn");
            }

            em.remove(invoice);
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}