package com.model.mapper;


import com.model.dto.DepartmentDto;
import com.model.entity.Department;
import com.model.entity.Doctor;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public final class DepartmentMapper {

    private DepartmentMapper() {
        // chặn new
    }

    // =========================
    // ENTITY -> DTO
    // =========================
    public static DepartmentDto toDto(Department entity) {
        if (entity == null) return null;

        DepartmentDto dto = new DepartmentDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setBaseFee(entity.getBaseFee());
        dto.setDescription(entity.getDescription());

        // map danh sách tên bác sĩ để hiển thị read-only bên UI
        if (entity.getDoctors() != null) {
            List<String> doctorNames = entity.getDoctors()
                    .stream()
                    .filter(Objects::nonNull)
                    .map(Doctor::getFullName)
                    .filter(Objects::nonNull)
                    .sorted()
                    .collect(Collectors.toList());
            dto.setDoctorNames(doctorNames);
        } else {
            dto.setDoctorNames(Collections.emptyList());
        }

        return dto;
    }

    // =========================
    // LIST<ENTITY> -> LIST<DTO>
    // =========================
    public static List<DepartmentDto> toDtoList(List<Department> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream()
                .map(DepartmentMapper::toDto)
                .collect(Collectors.toList());
    }

    // =========================
    // DTO -> ENTITY (cho create)
    // =========================
    public static Department toEntity(DepartmentDto dto) {
        if (dto == null) return null;

        Department entity = new Department();

        // id thường để null, JPA sẽ tự generate. Nếu bạn muốn cho phép setId thủ công thì mở comment.
        // entity.setId(dto.getId());

        entity.setName(dto.getName());
        entity.setBaseFee(dto.getBaseFee());
        entity.setDescription(dto.getDescription());

        // KHÔNG set doctors ở đây
        // KHÔNG set appointments ở đây
        return entity;
    }

    // =========================
    // UPDATE ENTITY TỒN TẠI từ DTO
    // =========================
    /**
     * copy các field cho phép chỉnh sửa từ dto sang entity.
     * dùng cho update: bạn fetch entity từ DB bằng repo, rồi applyToEntity(dto, entity), rồi repo.save(entity)
     */
    public static void applyToEntity(DepartmentDto dto, Department entity) {
        if (dto == null || entity == null) return;

        entity.setName(dto.getName());
        entity.setBaseFee(dto.getBaseFee());
        entity.setDescription(dto.getDescription());
        // doctors & appointments không đụng ở đây
    }
}

