package com.service;

import com.model.dto.MedicalRecordDto;

import java.util.List;

public interface IMedicalRecordService {
    List<MedicalRecordDto> getAllMedicalRecords(String search, String startDate, String endDate);
    MedicalRecordDto getMedicalRecordById(Integer id);
    MedicalRecordDto getMedicalRecordByAppointmentId(Integer appointmentId);
    MedicalRecordDto createMedicalRecord(MedicalRecordDto dto);
    MedicalRecordDto updateMedicalRecord(Integer id, MedicalRecordDto dto);
    void deleteMedicalRecord(Integer id);
}
