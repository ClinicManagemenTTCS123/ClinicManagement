package com.model.dto;

import com.model.enums.UserRole;

import java.time.LocalDateTime;

public class UserDto {
    private Integer id;
    private String username;
    private String password;   // plaintext tạm thời, vì bạn chưa hash
    private UserRole role;
    private Boolean active;
    private LocalDateTime createdAt;

    // ===== Constructors =====
    public UserDto() {}

    public UserDto(Integer id, String username, String password, Boolean active, UserRole role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.active = active;
        this.role = role;
    }

    public UserDto(Integer id, String username, String password, Boolean active, UserRole role, LocalDateTime createdAt) {
        this(id, username, password, active, role);
        this.createdAt = createdAt;
    }

    // ===== Getters / Setters =====
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // ===== Convenience methods =====
    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", role=" + role +
                ", active=" + active +
                ", createdAt=" + createdAt +
                '}';
    }
}

