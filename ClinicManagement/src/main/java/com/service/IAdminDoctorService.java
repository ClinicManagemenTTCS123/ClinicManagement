package com.service;

import com.model.dto.DoctorDto;
import com.model.enums.DoctorStatus;

import java.util.List;

public interface IAdminDoctorService {
    List<DoctorDto> searchDoctors(String keyword, Integer departmentId, DoctorStatus status);
    DoctorDto getDoctor(Integer id);
    DoctorDto createDoctor(DoctorDto dto);
    DoctorDto updateDoctor(Integer id, DoctorDto dto);
    void deleteDoctor(Integer id);
}
