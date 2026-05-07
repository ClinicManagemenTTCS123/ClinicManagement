package com.service;

import com.model.dto.*;

import java.util.List;

public interface IDoctorService {
    DoctorDashboardDto getDashboardStats(Integer doctorId);
    List<AppointmentDto> getAppointments(Integer doctorId, String search, String status, String startDate, String endDate);
    List<PatientDto> getPatientsByDoctor(Integer doctorId, String search);
    List<MedicalRecordDto> getMedicalRecords(Integer doctorId, String search, String startDate, String endDate);
    DoctorDto getDoctorProfile(Integer id);
    DoctorDto updateDoctorProfile(Integer id, DoctorDto dto);
    AppointmentDto updateAppointmentStatus(Integer doctorId, Integer appointmentId, String status);
}
