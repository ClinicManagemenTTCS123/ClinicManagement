package com.controller;

import com.dao.jpa.EntityManagerProvider;
import com.model.dto.DashboardSummaryDto;
import com.model.enums.InvoiceStatus;
import jakarta.persistence.EntityManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    // Dashboard thống kê nhanh cho Admin
    @GetMapping
    public ResponseEntity<DashboardSummaryDto> getDashboard() {
        EntityManager em = EntityManagerProvider.em();
        try {
            DashboardSummaryDto dto = new DashboardSummaryDto();

            LocalDate today = LocalDate.now();
            LocalDateTime todayStart = today.atStartOfDay();
            LocalDateTime todayEnd = today.plusDays(1).atStartOfDay().minusNanos(1);

            Long totalDoctors = em.createQuery(
                            "SELECT COUNT(d) FROM Doctor d",
                            Long.class
                    )
                    .getSingleResult();

            Long totalPatients = em.createQuery(
                            "SELECT COUNT(p) FROM Patient p",
                            Long.class
                    )
                    .getSingleResult();

            Long totalDepartments = em.createQuery(
                            "SELECT COUNT(d) FROM Department d",
                            Long.class
                    )
                    .getSingleResult();

            Long appointmentsToday = em.createQuery(
                            "SELECT COUNT(a) FROM Appointment a WHERE a.startTime BETWEEN :from AND :to",
                            Long.class
                    )
                    .setParameter("from", todayStart)
                    .setParameter("to", todayEnd)
                    .getSingleResult();

            Long pendingInvoices = em.createQuery(
                            "SELECT COUNT(i) FROM Invoice i WHERE i.status = :status",
                            Long.class
                    )
                    .setParameter("status", InvoiceStatus.UNPAID)
                    .getSingleResult();

            Long totalMedicalRecords = em.createQuery(
                            "SELECT COUNT(mr) FROM MedicalRecord mr",
                            Long.class
                    )
                    .getSingleResult();

            dto.setTotalDoctors(totalDoctors == null ? 0 : totalDoctors);
            dto.setTotalPatients(totalPatients == null ? 0 : totalPatients);
            dto.setTotalDepartments(totalDepartments == null ? 0 : totalDepartments);
            dto.setAppointmentsToday(appointmentsToday == null ? 0 : appointmentsToday);
            dto.setPendingInvoices(pendingInvoices == null ? 0 : pendingInvoices);
            dto.setTotalMedicalRecords(totalMedicalRecords == null ? 0 : totalMedicalRecords);

            return ResponseEntity.ok(dto);
        } finally {
            em.close();
        }
    }
}
