package com.model.mapper;


import com.model.dto.DoctorDto;
import com.model.entity.Department;
import com.model.entity.Doctor;

public final class DoctorMapper {
    private DoctorMapper() {}

    public static DoctorDto toDTO(Doctor entity)
    {
        if(entity == null) return null;

        DoctorDto dto = new DoctorDto();
        dto.setId(entity.getId());
        if (entity.getDepartment() != null) {
            dto.setDepartmentId(entity.getDepartment().getId());
            dto.setDepartmentName(entity.getDepartment().getName());
        }
        dto.setFullName(entity.getFullName());
        dto.setGender(entity.getGender());
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setAddress(entity.getAddress());
        dto.setConsultationFee(entity.getConsultationFee());
        dto.setDoctorStatus(entity.getStatus());
        dto.setNotes(entity.getNotes());
        return dto;

    }

    public static Doctor toEntity(DoctorDto dto, Department managedDept)
    {
        if (dto == null) return null;
        Doctor e = new Doctor();

        // Nếu DTO có id thì gán (tránh mất id khi update)
        e.setId(dto.getId());

        e.setFullName(dto.getFullName());
        e.setGender(dto.getGender());
        e.setDateOfBirth(dto.getDateOfBirth());
        e.setPhone(dto.getPhone());
        e.setEmail(dto.getEmail());
        e.setAddress(dto.getAddress());
        e.setConsultationFee(dto.getConsultationFee());
        e.setStatus(dto.getDoctorStatus());
        e.setNotes(dto.getNotes());

        if (managedDept != null) e.setDepartment(managedDept);

        return e;
    }

}


