package com.service.impl;

import com.dao.impl.AppointmentRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.AppointmentDto;
import com.model.entity.Appointment;
import com.model.entity.Department;
import com.model.entity.Doctor;
import com.model.entity.Patient;
import com.model.enums.AppointmentStatus;
import com.model.mapper.AppointmentMapper;
import com.service.IAdminAppointmentService;
import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.util.List;

public class AdminAppointmentService implements IAdminAppointmentService {

    private final AppointmentRepository appointmentRepo = new AppointmentRepository();

    @Override
    public List<AppointmentDto> getAllAppointments(String search, String status, String startDate, String endDate) {
        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate start = (startDate != null && !startDate.trim().isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.trim().isEmpty()) ? LocalDate.parse(endDate) : null;

            List<Appointment> list = appointmentRepo.searchAllAppointmentsForAdmin(em, search, status, start, end);
            return AppointmentMapper.toDtoList(list);
        } finally {
            em.close();
        }
    }

    @Override
    public AppointmentDto createAppointment(AppointmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            if (dto.getPatientId() == null) throw new IllegalArgumentException("Thiếu ID bệnh nhân");
            if (dto.getDepartmentId() == null) throw new IllegalArgumentException("Thiếu ID chuyên khoa");
            if (dto.getStartTime() == null) throw new IllegalArgumentException("Thiếu thời gian hẹn");

            Appointment apt = new Appointment();

            Patient patient = em.find(Patient.class, dto.getPatientId());
            Department dept = em.find(Department.class, dto.getDepartmentId());
            Doctor doctor = dto.getDoctorId() != null ? em.find(Doctor.class, dto.getDoctorId()) : null;

            if (patient == null || dept == null) {
                throw new IllegalArgumentException("Không tìm thấy thông tin bệnh nhân hoặc chuyên khoa");
            }

            apt.setPatient(patient);
            apt.setDepartment(dept);
            apt.setDoctor(doctor);
            apt.setStartTime(dto.getStartTime());
            apt.setAppointment_date(dto.getStartTime().toLocalDate());
            apt.setReason(dto.getReason());
            apt.setStatus(AppointmentStatus.PENDING);

            appointmentRepo.save(em, apt);

            em.getTransaction().commit();
            return AppointmentMapper.toDto(apt);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public AppointmentDto updateAppointment(Integer id, AppointmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Appointment apt = appointmentRepo.findById(em, id);
            if (apt == null) throw new IllegalArgumentException("Không tìm thấy lịch hẹn");

            if (dto.getStatus() != null) apt.setStatus(dto.getStatus());
            if (dto.getReason() != null) apt.setReason(dto.getReason());
            if (dto.getStartTime() != null) {
                apt.setStartTime(dto.getStartTime());
                apt.setAppointment_date(dto.getStartTime().toLocalDate());
            }
            if (dto.getDoctorId() != null) {
                Doctor doctor = em.find(Doctor.class, dto.getDoctorId());
                if (doctor == null) throw new IllegalArgumentException("Không tìm thấy bác sĩ");
                apt.setDoctor(doctor);
            }

            appointmentRepo.save(em, apt);

            em.getTransaction().commit();
            return AppointmentMapper.toDto(apt);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public void deleteAppointment(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Appointment apt = appointmentRepo.findById(em, id);
            if (apt == null) throw new IllegalArgumentException("Không tìm thấy lịch hẹn");

            em.remove(apt);

            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}