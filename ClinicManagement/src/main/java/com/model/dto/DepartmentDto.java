package com.model.dto;


import java.util.List;

public class DepartmentDto {
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getBaseFee() {
        return baseFee;
    }

    public void setBaseFee(Double baseFee) {
        this.baseFee = baseFee;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    private Integer id;
    private String name;
    private Double baseFee;
    private String description;

    public List<String> getDoctorNames() {
        return doctorNames;
    }

    public void setDoctorNames(List<String> doctorNames) {
        this.doctorNames = doctorNames;
    }

    private List<String> doctorNames;

    private List<String> doctorPhones;
    public List<String> getDoctorPhones() { return doctorPhones; }
    public void setDoctorPhones(List<String> doctorPhones) { this.doctorPhones = doctorPhones; }


}
