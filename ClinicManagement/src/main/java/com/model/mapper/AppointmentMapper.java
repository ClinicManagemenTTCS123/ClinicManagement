package com.model.mapper;


import com.model.dto.AppointmentDto;
import com.model.entity.Appointment;

import java.util.List;
import java.util.stream.Collectors;

public class AppointmentMapper {

    public static AppointmentDto toDto(Appointment appointment) {
        if (appointment == null) {
            return null;
        }

        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setStartTime(appointment.getStartTime());
        dto.setStatus(appointment.getStatus());
        dto.setReason(appointment.getReason());

        if (appointment.getPatient() != null) {
            dto.setPatientId(appointment.getPatient().getId());
            dto.setPatientName(appointment.getPatient().getFullName());
            dto.setPatient(PatientMapper.toDto(appointment.getPatient()));

        }

        if (appointment.getDoctor() != null) {
            dto.setDoctorId(appointment.getDoctor().getId());
            dto.setDoctorName(appointment.getDoctor().getFullName());
        }

        if (appointment.getDepartment() != null) {
            dto.setDepartmentId(appointment.getDepartment().getId());
            dto.setDepartmentName(appointment.getDepartment().getName());
        }

        return dto;
    }

    public static List<AppointmentDto> toDtoList(List<Appointment> appointments) {
        if (appointments == null) {
            return null;
        }
        return appointments.stream()
                .map(AppointmentMapper::toDto)
                .collect(Collectors.toList());
    }
}

