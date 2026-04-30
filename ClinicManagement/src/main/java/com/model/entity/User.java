package com.model.entity;


import com.model.enums.UserRole;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users",
        uniqueConstraints = @UniqueConstraint(name = "uk_user_username", columnNames = "username"))
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // PK int

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private UserRole role;


    @Column(nullable = false)
    private Boolean active = true; // map INTEGER(1/0) của SQLite


    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;


    // getters/setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
