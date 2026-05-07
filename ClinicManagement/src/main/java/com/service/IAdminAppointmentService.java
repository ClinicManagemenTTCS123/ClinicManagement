package com.service;

import com.model.dto.AppointmentDto;

import java.util.List;

public interface IAdminAppointmentService {
    List<AppointmentDto> getAllAppointments(String search, String status, String startDate, String endDate);
    AppointmentDto createAppointment(AppointmentDto dto);
    AppointmentDto updateAppointment(Integer id, AppointmentDto dto);
    void deleteAppointment(Integer id);
}
