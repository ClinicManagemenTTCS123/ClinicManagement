package com.model.dto;

import com.model.enums.DoctorStatus;
import com.model.enums.Gender;

import java.time.LocalDate;

public class DoctorDto {
    private Integer id;
    private Integer departmentId;
    private String departmentName;
    private String fullName;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String phone;
    private String email;
    private String address;
    private Double consultationFee;
    private String notes;
    private DoctorStatus doctorStatus;

    //getter/setter

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public DoctorStatus getDoctorStatus() {
        return doctorStatus;
    }

    public void setDoctorStatus(DoctorStatus doctorStatus) {
        this.doctorStatus = doctorStatus;
    }

    private String avatar;

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return   departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
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
}

