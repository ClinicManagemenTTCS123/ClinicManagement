package com.model.entity;

import com.model.entity.*;
import com.model.enums.AppointmentStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "appointments",
        indexes = {
                @Index(name = "idx_appt_doctor_time", columnList = "doctor_id,start_time"),
                @Index(name = "idx_appt_patient_time", columnList = "patient_id,start_time")
        })
public class Appointment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // PK int


    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_appt_patient"))
    private Patient patient;


    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_appt_department"))
    private Department department;


    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "doctor_id",
            foreignKey = @ForeignKey(name = "fk_appt_doctor"))
    private Doctor doctor; // có thể null


    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 12)
    private AppointmentStatus status = AppointmentStatus.PENDING;


    @Column
    private String reason;

    @Column
    private LocalDate appointment_date;

    @OneToOne(mappedBy = "appointment", fetch = FetchType.LAZY)
    private Invoice invoice;

    //tbao
    @OneToOne(mappedBy = "appointment", fetch = FetchType.LAZY)
    private MedicalRecord medicalRecord;


    // getters/setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }
    public MedicalRecord getMedicalRecord() { return medicalRecord; }
    public void setMedicalRecord(MedicalRecord medicalRecord) { this.medicalRecord = medicalRecord; }
    public LocalDate getAppointment_date() {
        return appointment_date;
    }

    public void setAppointment_date(LocalDate appointment_date) {
        this.appointment_date = appointment_date;
    }
}
