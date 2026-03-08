package com.model.entity;


import com.model.enums.InvoiceStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "invoices",
        uniqueConstraints = @UniqueConstraint(name = "uk_invoice_appointment", columnNames = "appointment_id"))
public class Invoice {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // PK int


    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_invoice_appointment"))
    private Appointment appointment;


    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_invoice_patient"))
    private Patient patient;

    // tbao
    @Column(nullable = false)
    private Double total;


    @Column
    private String details;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private InvoiceStatus status = InvoiceStatus.UNPAID;


    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;


    // getters/setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public InvoiceStatus getStatus() { return status; }
    public void setStatus(InvoiceStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

}
