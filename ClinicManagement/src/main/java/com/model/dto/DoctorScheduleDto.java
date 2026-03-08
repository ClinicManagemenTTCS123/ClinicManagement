package com.model.dto;

public class DoctorScheduleDto {
    private Integer id;
    private Integer doctorId;
    private String workDate; // Định dạng "yyyy-MM-dd"
    private String workTime; // Định dạng "HH:mm"
    private String status;   // "AVAILABLE" hoặc "OFF"

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public String getWorkDate() {
        return workDate;
    }

    public void setWorkDate(String workDate) {
        this.workDate = workDate;
    }

    public String getWorkTime() {
        return workTime;
    }

    public void setWorkTime(String workTime) {
        this.workTime = workTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
