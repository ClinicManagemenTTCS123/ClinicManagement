package com.model.entity;

import jakarta.persistence.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(
        name = "departments",
        uniqueConstraints = @UniqueConstraint(name = "uk_department_name",columnNames = "name")
)
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double baseFee;

    @Column
    private String description;

    @OneToMany(mappedBy = "department")
    private Set<Doctor> doctors = new LinkedHashSet<>();

    @OneToMany(mappedBy = "department")
    private Set<Appointment> appointments = new LinkedHashSet<>();

    // getters/setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getBaseFee() { return baseFee; }
    public void setBaseFee(Double baseFee) { this.baseFee = baseFee; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Set<Doctor> getDoctors() { return doctors; }
    public void setDoctors(Set<Doctor> doctors) { this.doctors = doctors; }
    public Set<Appointment> getAppointments() { return appointments; }
    public void setAppointments(Set<Appointment> appointments) { this.appointments = appointments; }

}
