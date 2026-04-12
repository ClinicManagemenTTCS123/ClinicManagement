package com.model.dto;

public class AuthResponse {
    private String message;
    private String role;
    private Integer doctorId;
    public AuthResponse(String message, String role, Integer doctorId) {
        this.message = message;
        this.role = role;
        this.doctorId = doctorId;
    }

    public AuthResponse(String message, String role) {
        this.message = message;
        this.role = role;
        this.doctorId = null;
    }

    public String getMessage() { return message; }
    public String getRole() { return role; }
    public Integer getDoctorId() { return doctorId; }
}