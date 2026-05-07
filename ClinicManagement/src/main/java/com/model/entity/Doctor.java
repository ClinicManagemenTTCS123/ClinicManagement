package com.model.entity;

import com.model.enums.DoctorStatus;
import com.model.enums.Gender;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "doctors",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_doctor_phone", columnNames = "phone"),
                @UniqueConstraint(name = "uk_doctor_email", columnNames = "email")
        })
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_doctor_department"))
    private Department department;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    private String phone;

    @Column(nullable = false)
    private String email;

    @Column
    private String address;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private DoctorStatus status;

    @OneToMany(mappedBy = "doctor")
    private Set<Appointment> appointments = new LinkedHashSet<>();

    @OneToMany(mappedBy = "doctor")
    private Set<MedicalRecord> medicalRecords = new LinkedHashSet<>();

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String avatar;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }


    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Double consultationFee) { this.consultationFee = consultationFee; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public DoctorStatus getStatus() { return status; }
    public void setStatus(DoctorStatus status) { this.status = status; }

    public Set<Appointment> getAppointments() { return appointments; }
    public void setAppointments(Set<Appointment> appointments) { this.appointments = appointments; }

    public Set<MedicalRecord> getMedicalRecords() { return medicalRecords; }
    public void setMedicalRecords(Set<MedicalRecord> medicalRecords) { this.medicalRecords = medicalRecords; }
}