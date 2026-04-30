package com.controller;

import com.dao.impl.InvoiceRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.InvoiceDto;
import com.model.entity.Invoice;
import com.model.enums.InvoiceStatus;
import com.model.mapper.InvoiceMapper;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/invoices")
public class AdminInvoiceController {

    private final InvoiceRepository invoiceRepo = new InvoiceRepository();
    private final InvoiceMapper invoiceMapper = new InvoiceMapper();

    @GetMapping
    public ResponseEntity<?> getAllInvoices() {
        EntityManager em = EntityManagerProvider.em();
        try {
            List<Invoice> invoices = invoiceRepo.findAll(em);
            return ResponseEntity.ok(invoiceMapper.toDtoList(invoices));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải hóa đơn: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateInvoiceStatus(@PathVariable Integer id, @RequestParam InvoiceStatus status) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Invoice invoice = em.find(Invoice.class, id);
            if (invoice == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy hóa đơn");
            }
            invoice.setStatus(status);
            invoiceRepo.save(em, invoice);
            em.getTransaction().commit();
            return ResponseEntity.ok("Cập nhật thành công");
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Invoice invoice = em.find(Invoice.class, id);
            if (invoice != null) {
                em.remove(invoice);
            }
            em.getTransaction().commit();
            return ResponseEntity.ok("Xóa hóa đơn thành công");
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }
}