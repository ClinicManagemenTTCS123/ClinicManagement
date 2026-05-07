package com.service.impl;

import com.dao.impl.AppointmentRepository;
import com.dao.impl.DoctorRepository;
import com.dao.impl.MedicalRecordRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.MedicalRecordDto;
import com.model.entity.Appointment;
import com.model.entity.Doctor;
import com.model.entity.MedicalRecord;
import com.model.entity.Patient;
import com.model.enums.AppointmentStatus;
import com.model.mapper.MedicalRecordMapper;
import com.service.IMedicalRecordService;
import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.util.List;

public class MedicalRecordService implements IMedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepo = new MedicalRecordRepository();
    private final AppointmentRepository appointmentRepo = new AppointmentRepository();
    private final DoctorRepository doctorRepo = new DoctorRepository();
    private final MedicalRecordMapper medicalRecordMapper = new MedicalRecordMapper();

    @Override
    public List<MedicalRecordDto> getAllMedicalRecords(String search, String startDate, String endDate) {
        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate start = (startDate != null && !startDate.trim().isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.trim().isEmpty()) ? LocalDate.parse(endDate) : null;

            List<MedicalRecord> records = medicalRecordRepo.searchAllMedicalRecords(em, search, start, end);
            return medicalRecordMapper.toDtoList(records);
        } finally {
            em.close();
        }
    }

    @Override
    public MedicalRecordDto getMedicalRecordById(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            MedicalRecord record = medicalRecordRepo.findById(em, id);
            if (record == null) {
                throw new IllegalArgumentException("Không tìm thấy bệnh án");
            }
            return MedicalRecordMapper.toDto(record);
        } finally {
            em.close();
        }
    }

    @Override
    public MedicalRecordDto getMedicalRecordByAppointmentId(Integer appointmentId) {
        EntityManager em = EntityManagerProvider.em();
        try {
            MedicalRecord record = medicalRecordRepo.findByAppointmentId(em, appointmentId);
            if (record == null) {
                throw new IllegalArgumentException("Không tìm thấy bệnh án cho lịch hẹn này");
            }
            return MedicalRecordMapper.toDto(record);
        } finally {
            em.close();
        }
    }

    @Override
    public MedicalRecordDto createMedicalRecord(MedicalRecordDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            if (dto.getAppointmentId() == null) throw new IllegalArgumentException("Mã lịch hẹn không được để trống");
            if (dto.getPatientId() == null) throw new IllegalArgumentException("Mã bệnh nhân không được để trống");
            if (dto.getDoctorId() == null) throw new IllegalArgumentException("Mã bác sĩ không được để trống");

            // 1. Kiểm tra xem lịch hẹn đã có bệnh án chưa
            MedicalRecord existing = medicalRecordRepo.findByAppointmentId(em, dto.getAppointmentId());
            if (existing != null) {
                throw new IllegalArgumentException("Lịch hẹn này đã có bệnh án");
            }

            // 2. Fetch các Entity liên quan
            Appointment appointment = appointmentRepo.findById(em, dto.getAppointmentId());
            if (appointment == null) throw new IllegalArgumentException("Không tìm thấy lịch hẹn");

            Patient patient = em.find(Patient.class, dto.getPatientId());
            if (patient == null) throw new IllegalArgumentException("Không tìm thấy bệnh nhân");

            Doctor doctor = doctorRepo.findById(em, dto.getDoctorId());
            if (doctor == null) throw new IllegalArgumentException("Không tìm thấy bác sĩ");

            // 3. Tạo Entity mới
            MedicalRecord record = medicalRecordMapper.toEntity(dto);
            record.setAppointment(appointment);
            record.setPatient(patient);
            record.setDoctor(doctor);

            medicalRecordRepo.save(em, record);

            // 4. Cập nhật trạng thái lịch hẹn thành COMPLETED
            appointment.setStatus(AppointmentStatus.COMPLETED);
            appointmentRepo.save(em, appointment);

            em.getTransaction().commit();
            return MedicalRecordMapper.toDto(record);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public MedicalRecordDto updateMedicalRecord(Integer id, MedicalRecordDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            MedicalRecord record = medicalRecordRepo.findById(em, id);
            if (record == null) {
                throw new IllegalArgumentException("Không tìm thấy bệnh án");
            }

            medicalRecordMapper.updateEntityFromDto(dto, record);
            MedicalRecord updated = medicalRecordRepo.update(em, record);

            em.getTransaction().commit();
            return MedicalRecordMapper.toDto(updated);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public void deleteMedicalRecord(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            MedicalRecord record = medicalRecordRepo.findById(em, id);
            if (record == null) {
                throw new IllegalArgumentException("Không tìm thấy bệnh án");
            }

            medicalRecordRepo.deleteById(em, id);

            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}