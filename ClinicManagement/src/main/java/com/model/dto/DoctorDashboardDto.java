package com.model.dto;

import java.util.List;

public class DoctorDashboardDto {
    private long appointmentsToday;
    private long totalPatients;
    private long totalMedicalRecords;
    private String nextAppointmentTime;
    private String nextAppointmentPatient;
    private List<AppointmentDto> upcomingAppointments;

    public long getAppointmentsToday() { return appointmentsToday; }
    public void setAppointmentsToday(long appointmentsToday) { this.appointmentsToday = appointmentsToday; }
    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }
    public long getTotalMedicalRecords() { return totalMedicalRecords; }
    public void setTotalMedicalRecords(long totalMedicalRecords) { this.totalMedicalRecords = totalMedicalRecords; }
    public String getNextAppointmentTime() { return nextAppointmentTime; }
    public void setNextAppointmentTime(String nextAppointmentTime) { this.nextAppointmentTime = nextAppointmentTime; }
    public String getNextAppointmentPatient() { return nextAppointmentPatient; }
    public void setNextAppointmentPatient(String nextAppointmentPatient) { this.nextAppointmentPatient = nextAppointmentPatient; }
    public List<AppointmentDto> getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(List<AppointmentDto> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
}