package com.model.dto;

import java.util.List;

public class PatientDashboardDto {
    private Integer patientId;
    private String patientName;
    private long upcomingAppointmentsCount;
    private long unpaidInvoicesCount;
    private double unpaidInvoicesTotal;
    private long totalMedicalRecords;
    private List<AppointmentDto> upcomingAppointments;
    private List<InvoiceDto> recentInvoices;
    private MedicalRecordDto latestMedicalRecord;

    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public long getUpcomingAppointmentsCount() { return upcomingAppointmentsCount; }
    public void setUpcomingAppointmentsCount(long upcomingAppointmentsCount) { this.upcomingAppointmentsCount = upcomingAppointmentsCount; }
    public long getUnpaidInvoicesCount() { return unpaidInvoicesCount; }
    public void setUnpaidInvoicesCount(long unpaidInvoicesCount) { this.unpaidInvoicesCount = unpaidInvoicesCount; }
    public double getUnpaidInvoicesTotal() { return unpaidInvoicesTotal; }
    public void setUnpaidInvoicesTotal(double unpaidInvoicesTotal) { this.unpaidInvoicesTotal = unpaidInvoicesTotal; }
    public long getTotalMedicalRecords() { return totalMedicalRecords; }
    public void setTotalMedicalRecords(long totalMedicalRecords) { this.totalMedicalRecords = totalMedicalRecords; }
    public List<AppointmentDto> getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(List<AppointmentDto> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
    public List<InvoiceDto> getRecentInvoices() { return recentInvoices; }
    public void setRecentInvoices(List<InvoiceDto> recentInvoices) { this.recentInvoices = recentInvoices; }
    public MedicalRecordDto getLatestMedicalRecord() { return latestMedicalRecord; }
    public void setLatestMedicalRecord(MedicalRecordDto latestMedicalRecord) { this.latestMedicalRecord = latestMedicalRecord; }
}
