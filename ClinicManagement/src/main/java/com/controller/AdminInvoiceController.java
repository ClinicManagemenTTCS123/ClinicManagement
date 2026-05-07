package com.controller;

import com.model.enums.InvoiceStatus;
import com.service.IInvoiceService;
import com.service.impl.InvoiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/invoices")
public class AdminInvoiceController {

    private final IInvoiceService invoiceService = new InvoiceService();

    @GetMapping
    public ResponseEntity<?> getAllInvoices() {
        try {
            return ResponseEntity.ok(invoiceService.getAllInvoices());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải hóa đơn: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateInvoiceStatus(@PathVariable Integer id, @RequestParam InvoiceStatus status) {
        try {
            invoiceService.updateInvoiceStatus(id, status);
            return ResponseEntity.ok("Cập nhật thành công");
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Integer id) {
        try {
            invoiceService.deleteInvoice(id);
            return ResponseEntity.ok("Xóa hóa đơn thành công");
        } catch (Exception e) {
            return handleException(e);
        }
    }

    private ResponseEntity<?> handleException(Exception e) {
        String msg = e.getMessage() != null ? e.getMessage() : "Lỗi hệ thống";
        if (msg.toLowerCase().contains("không tìm thấy")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }
        return ResponseEntity.badRequest().body(msg);
    }
}