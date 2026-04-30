package com.model.dto;

public class AuthResponse {
    private String message;
    private String role;
    private Integer doctorId;
    private Integer patientId;


    public AuthResponse(String message, String role, Integer doctorId, Integer patientId) {
        this.message = message;
        this.role = role;
        this.doctorId = doctorId;
        this.patientId = patientId;

    }

    public AuthResponse(String message, String role) {
        this.message = message;
        this.role = role;
        this.doctorId = null;
        this.patientId = null;
    }

    public String getMessage() { return message; }
    public String getRole() { return role; }
    public Integer getDoctorId() { return doctorId; }
    public Integer getPatientId() { return patientId; }
}