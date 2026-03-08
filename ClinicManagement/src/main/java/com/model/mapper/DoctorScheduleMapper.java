package com.model.mapper;


import com.model.dto.DoctorScheduleDto;
import com.model.entity.Doctor;
import com.model.entity.DoctorSchedule;
import com.model.enums.DoctorScheduleStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class DoctorScheduleMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE; // yyyy-MM-dd
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Chuyển đổi Entity DoctorSchedule sang DTO.
     */
    public static DoctorScheduleDto toDTO(DoctorSchedule entity) {
        if (entity == null) return null;

        DoctorScheduleDto dto = new DoctorScheduleDto();
        dto.setId(entity.getId());
        dto.setStatus(entity.getStatus().name()); // Chuyển Enum sang String

        if (entity.getDoctor() != null) {
            dto.setDoctorId(entity.getDoctor().getId());
        }

        if (entity.getWorkDate() != null) {
            dto.setWorkDate(entity.getWorkDate().format(DATE_FORMATTER));
        }

        if (entity.getStartTime() != null) {
            dto.setWorkTime(entity.getStartTime().format(TIME_FORMATTER));
        }

        return dto;
    }

    /**
     * Chuyển đổi DTO sang Entity.
     * Cần một đối tượng Doctor (đã được quản lý bởi JPA) để thiết lập quan hệ.
     */
    public static DoctorSchedule toEntity(DoctorScheduleDto dto, Doctor doctor) {
        if (dto == null) return null;

        DoctorSchedule entity = new DoctorSchedule();
        // ID thường không được set từ DTO khi tạo mới

        entity.setDoctor(doctor); // Thiết lập quan hệ

        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            entity.setStatus(DoctorScheduleStatus.valueOf(dto.getStatus())); // Chuyển String sang Enum
        } else {
            entity.setStatus(DoctorScheduleStatus.AVAILABLE); // Mặc định
        }

        if (dto.getWorkDate() != null && !dto.getWorkDate().isBlank()) {
            entity.setWorkDate(LocalDate.parse(dto.getWorkDate(), DATE_FORMATTER));
        }

        if (dto.getWorkTime() != null && !dto.getWorkTime().isBlank()) {
            entity.setStartTime(LocalTime.parse(dto.getWorkTime(), TIME_FORMATTER));
        }

        return entity;
    }
}

