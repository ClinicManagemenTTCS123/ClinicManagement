package com.service.impl;

import com.dao.impl.*;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.*;
import com.model.entity.*;
import com.model.mapper.*;
import com.service.IDoctorService;
import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class DoctorService implements IDoctorService {

    private final AppointmentRepository appointmentRepo = new AppointmentRepository();
    private final PatientRepository patientRepo = new PatientRepository();
    private final MedicalRecordRepository medicalRecordRepo = new MedicalRecordRepository();
    private final DoctorRepository doctorRepo = new DoctorRepository();
    private final MedicalRecordMapper medicalRecordMapper = new MedicalRecordMapper();

    @Override
    public DoctorDashboardDto getDashboardStats(Integer doctorId) {
        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate today = LocalDate.now();
            LocalDateTime now = LocalDateTime.now();

            DoctorDashboardDto dto = new DoctorDashboardDto();

            dto.setAppointmentsToday(appointmentRepo.countAppointmentsToday(em, doctorId, today));
            dto.setTotalPatients(appointmentRepo.countTotalPatients(em, doctorId));
            dto.setTotalMedicalRecords(appointmentRepo.countMedicalRecords(em, doctorId));

            Appointment nextAppt = appointmentRepo.getNextAppointment(em, doctorId, now);
            if (nextAppt != null) {
                dto.setNextAppointmentTime(nextAppt.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")));
                dto.setNextAppointmentPatient(nextAppt.getPatient().getFullName());
            } else {
                dto.setNextAppointmentTime("--:--");
                dto.setNextAppointmentPatient("Không có");
            }

            List<Appointment> upcomingList = appointmentRepo.getUpcomingAppointments(em, doctorId, now, 10);
            List<AppointmentDto> upcomingDtoList = upcomingList.stream()
                    .map(AppointmentMapper::toDto)
                    .collect(Collectors.toList());
            dto.setUpcomingAppointments(upcomingDtoList);

            return dto;
        } finally {
            em.close();
        }
    }

    @Override
    public List<AppointmentDto> getAppointments(Integer doctorId, String search, String status, String startDate, String endDate) {
        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;

            List<Appointment> appointments = appointmentRepo.searchDoctorAppointments(
                    em, doctorId, search, status, start, end
            );
            return AppointmentMapper.toDtoList(appointments);
        } finally {
            em.close();
        }
    }

    @Override
    public List<PatientDto> getPatientsByDoctor(Integer doctorId, String search) {
        EntityManager em = EntityManagerProvider.em();
        try {
            List<Patient> patients = patientRepo.getPatientsByDoctorId(em, doctorId, search);
            return patients.stream().map(p -> {
                PatientDto dto = PatientMapper.toDto(p);
                if (p.getMedicalRecords() != null) {
                    dto.setVisitCount(p.getMedicalRecords().size());
                    dto.setHistory(medicalRecordMapper.toDtoList(p.getMedicalRecords().stream().toList()));
                } else {
                    dto.setVisitCount(0);
                }
                return dto;
            }).collect(Collectors.toList());
        } finally {
            em.close();
        }
    }

    @Override
    public List<MedicalRecordDto> getMedicalRecords(Integer doctorId, String search, String startDate, String endDate) {
        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;

            List<MedicalRecord> records = medicalRecordRepo.searchDoctorMedicalRecords(
                    em, doctorId, search, start, end
            );
            return medicalRecordMapper.toDtoList(records);
        } finally {
            em.close();
        }
    }

    @Override
    public DoctorDto getDoctorProfile(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            Doctor doctor = doctorRepo.findById(em, id);
            if (doctor == null) {
                throw new IllegalArgumentException("Không tìm thấy thông tin bác sĩ");
            }
            return DoctorMapper.toDTO(doctor);
        } finally {
            em.close();
        }
    }

    @Override
    public DoctorDto updateDoctorProfile(Integer id, DoctorDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Doctor existingDoctor = doctorRepo.findById(em, id);
            if (existingDoctor == null) {
                throw new IllegalArgumentException("Không tìm thấy thông tin bác sĩ");
            }

            if(dto.getFullName() != null) existingDoctor.setFullName(dto.getFullName());
            if(dto.getPhone() != null) existingDoctor.setPhone(dto.getPhone());
            if(dto.getEmail() != null) existingDoctor.setEmail(dto.getEmail());
            if(dto.getAddress() != null) existingDoctor.setAddress(dto.getAddress());
            if(dto.getGender() != null) existingDoctor.setGender(dto.getGender());
            if(dto.getDateOfBirth() != null) existingDoctor.setDateOfBirth(dto.getDateOfBirth());
            if(dto.getConsultationFee() != null) existingDoctor.setConsultationFee(dto.getConsultationFee());
            if(dto.getNotes() != null) existingDoctor.setNotes(dto.getNotes());
            if(dto.getDoctorStatus() != null) existingDoctor.setStatus(dto.getDoctorStatus());
            if(dto.getAvatar() != null) existingDoctor.setAvatar(dto.getAvatar());

            em.merge(existingDoctor);
            em.flush();

            em.getTransaction().commit();
            return DoctorMapper.toDTO(existingDoctor);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public AppointmentDto updateAppointmentStatus(Integer doctorId, Integer appointmentId, String status) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment appointment = appointmentRepo.findById(em, appointmentId);
            if (appointment == null || appointment.getDoctor() == null || !appointment.getDoctor().getId().equals(doctorId)) {
                throw new IllegalArgumentException("Không tìm thấy lịch hẹn hoặc không thuộc quyền quản lý");
            }
            appointment.setStatus(com.model.enums.AppointmentStatus.valueOf(status));
            appointmentRepo.save(em, appointment);

            em.getTransaction().commit();
            return AppointmentMapper.toDto(appointment);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}