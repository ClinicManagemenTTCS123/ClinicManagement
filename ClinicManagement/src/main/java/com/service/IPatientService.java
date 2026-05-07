package com.service;

import com.model.dto.*;

import java.util.List;

public interface IPatientService {
    List<PatientDto> getPatients(String search, String phone);
    PatientDto getPatient(Integer id);
    PatientDashboardDto getPatientDashboard(Integer id);
    List<AppointmentDto> getPatientAppointments(Integer id);
    AppointmentDto createPatientAppointment(Integer id, AppointmentDto dto);
    AppointmentDto cancelPatientAppointment(Integer patientId, Integer appointmentId);
    List<MedicalRecordDto> getPatientMedicalRecords(Integer id);
    List<InvoiceDto> getPatientInvoices(Integer id);
    PatientDto createPatient(PatientDto dto);
    PatientDto updatePatient(Integer id, PatientDto dto);
    void deletePatient(Integer id);
    AppointmentDto updatePatientAppointment(Integer patientId, Integer appointmentId, AppointmentDto dto);
    void payInvoice(Integer patientId, Integer invoiceId);
}
