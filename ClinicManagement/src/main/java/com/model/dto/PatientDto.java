package com.model.dto;

import com.model.enums.Gender;

import java.time.LocalDate;
import java.util.Objects;

public class PatientDto {
    private Integer id;
    private String fullName;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String phone;
    private String email;
    private String address;
    private String cccd;
    private String insuranceCode;

    public PatientDto() {}

    public PatientDto(Integer id, String fullName, Gender gender, LocalDate dateOfBirth,
                      String phone, String email, String address, String cccd, String insuranceCode) {
        this.id = id;
        this.fullName = fullName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.cccd = cccd;
        this.insuranceCode = insuranceCode;
    }

    // --- Getters/Setters ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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

    public String getCccd() { return cccd; }
    public void setCccd(String cccd) { this.cccd = cccd; }

    public String getInsuranceCode() { return insuranceCode; }
    public void setInsuranceCode(String insuranceCode) { this.insuranceCode = insuranceCode; }

    // --- Convenience methods ---
    public boolean hasPhone(String phoneNumber) {
        return phone != null && phone.equalsIgnoreCase(phoneNumber);
    }

    public boolean hasEmail(String email) {
        return email != null && email.equalsIgnoreCase(email);
    }

    @Override
    public String toString() {
        return String.format("%s (%s)",
                fullName != null ? fullName : "Không tên",
                phone != null ? phone : "Chưa có SĐT");
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PatientDto)) return false;
        PatientDto that = (PatientDto) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
