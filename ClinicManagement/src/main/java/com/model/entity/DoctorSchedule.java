package com.model.entity;


import com.model.enums.DoctorScheduleStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_schedule")
public class DoctorSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_schedule_doctor"))
    private Doctor doctor;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate; // Ánh xạ từ TEXT sang LocalDate

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime; // Ánh xạ từ TEXT sang LocalTime

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DoctorScheduleStatus status = DoctorScheduleStatus.AVAILABLE;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDate getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDate workDate) {
        this.workDate = workDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public DoctorScheduleStatus getStatus() {
        return status;
    }

    public void setStatus(DoctorScheduleStatus status) {
        this.status = status;
    }
}