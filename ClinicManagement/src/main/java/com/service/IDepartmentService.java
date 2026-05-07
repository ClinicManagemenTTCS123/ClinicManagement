package com.service;

import com.model.dto.DepartmentDto;

import java.util.List;

public interface IDepartmentService {
    List<DepartmentDto> getAllDepartments(String search);
    DepartmentDto getDepartment(Integer id);
    DepartmentDto createDepartment(DepartmentDto dto);
    DepartmentDto updateDepartment(Integer id, DepartmentDto dto);
    void deleteDepartment(Integer id);
}
