package com.model.dto;

public class DashboardSummaryDto {
    private long totalDoctors;
    private long totalPatients;
    private long totalDepartments;
    private long appointmentsToday;
    private long pendingInvoices;
    private long totalMedicalRecords;

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getAppointmentsToday() {
        return appointmentsToday;
    }

    public void setAppointmentsToday(long appointmentsToday) {
        this.appointmentsToday = appointmentsToday;
    }

    public long getPendingInvoices() {
        return pendingInvoices;
    }

    public void setPendingInvoices(long pendingInvoices) {
        this.pendingInvoices = pendingInvoices;
    }

    public long getTotalMedicalRecords() {
        return totalMedicalRecords;
    }

    public void setTotalMedicalRecords(long totalMedicalRecords) {
        this.totalMedicalRecords = totalMedicalRecords;
    }
}
