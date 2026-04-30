package com.controller;

import com.dao.impl.MedicalRecordRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.MedicalRecordDto;
import com.model.entity.Appointment;
import com.model.entity.MedicalRecord;
import com.model.mapper.MedicalRecordMapper;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepo = new MedicalRecordRepository();
    private final MedicalRecordMapper mapper = new MedicalRecordMapper();

    // Hồ sơ bệnh án: xem danh sách, tìm kiếm, lọc
    @GetMapping
    public ResponseEntity<List<MedicalRecordDto>> getAllMedicalRecords(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;
            return ResponseEntity.ok(mapper.toDtoList(medicalRecordRepo.searchAllMedicalRecords(em, search, start, end)));
        } finally {
            em.close();
        }
    }

    // Hồ sơ bệnh án: xem chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicalRecordById(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            MedicalRecord record = medicalRecordRepo.findById(em, id);
            if (record == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay ho so benh an");
            }
            return ResponseEntity.ok(mapper.toDto(record));
        } finally {
            em.close();
        }
    }

    // Hồ sơ bệnh án của bệnh nhân: xem lịch sử khám bệnh
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordDto>> getMedicalRecordsByPatient(@PathVariable Integer patientId) {
        EntityManager em = EntityManagerProvider.em();
        try {
            return ResponseEntity.ok(mapper.toDtoList(medicalRecordRepo.findByPatientId(em, patientId)));
        } finally {
            em.close();
        }
    }

    // Hồ sơ bệnh án: thêm mới
    @PostMapping
    public ResponseEntity<?> createMedicalRecord(@RequestBody MedicalRecordDto dto) {
        if (dto == null || dto.getAppointmentId() == null) {
            return ResponseEntity.badRequest().body("AppointmentId khong duoc de trong");
        }
        return upsertExamRecord(dto);
    }

    // Hồ sơ bệnh án: cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicalRecord(@PathVariable Integer id, @RequestBody MedicalRecordDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            validateMedicalRecordPayload(dto, false);

            MedicalRecord existingRecord = medicalRecordRepo.findById(em, id);
            if (existingRecord == null) {
                if (em.getTransaction().isActive()) {
                    em.getTransaction().rollback();
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay ho so benh an");
            }

            mapper.updateEntityFromDto(dto, existingRecord);
            em.merge(existingRecord);
            em.flush();
            em.getTransaction().commit();
            return ResponseEntity.ok(mapper.toDto(existingRecord));
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            return ResponseEntity.badRequest().body("Loi cap nhat ho so: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    // Hồ sơ bệnh án của bác sĩ: thêm hoặc lưu theo lịch hẹn
    @PostMapping("/upsert-exam")
    public ResponseEntity<?> upsertExamRecord(@RequestBody MedicalRecordDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            validateMedicalRecordPayload(dto, true);

            MedicalRecord record = medicalRecordRepo.findByAppointmentId(em, dto.getAppointmentId());
            if (record != null) {
                record.setSymptoms(dto.getSymptoms());
                record.setDiagnosis(dto.getDiagnosis() != null ? dto.getDiagnosis() : record.getDiagnosis());
                record.setPrescription(dto.getPrescription());
                record.setNotes(dto.getNotes());
                record.setIndications(dto.getIndications());
                record.setToothDetails(dto.getToothDetails());
                record.setServices(dto.getServices());
                medicalRecordRepo.update(em, record);
            } else {
                record = new MedicalRecord();
                Appointment apt = em.find(Appointment.class, dto.getAppointmentId());
                if (apt == null) {
                    throw new IllegalArgumentException("Khong tim thay lich hen");
                }
                if (apt.getPatient() == null || apt.getDoctor() == null) {
                    throw new IllegalArgumentException("Lich hen chua du du lieu benh nhan hoac bac si");
                }

                record.setAppointment(apt);
                record.setPatient(apt.getPatient());
                record.setDoctor(apt.getDoctor());
                record.setSymptoms(dto.getSymptoms());
                record.setDiagnosis(dto.getDiagnosis() != null ? dto.getDiagnosis() : "Dang cho ket qua kham");
                record.setPrescription(dto.getPrescription());
                record.setNotes(dto.getNotes());
                record.setIndications(dto.getIndications());
                record.setToothDetails(dto.getToothDetails());
                record.setServices(dto.getServices());

                medicalRecordRepo.save(em, record);
                apt.setStatus(com.model.enums.AppointmentStatus.COMPLETED);
                em.merge(apt);
            }

            em.getTransaction().commit();
            return ResponseEntity.ok(mapper.toDto(record));
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            return ResponseEntity.badRequest().body("Loi luu ho so: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    // Hồ sơ bệnh án: lấy theo lịch hẹn
    @GetMapping("/by-appointment/{aptId}")
    public ResponseEntity<?> getByAppointmentId(@PathVariable Integer aptId) {
        EntityManager em = EntityManagerProvider.em();
        try {
            MedicalRecord record = medicalRecordRepo.findByAppointmentId(em, aptId);
            if (record != null) {
                return ResponseEntity.ok(mapper.toDto(record));
            }
            return ResponseEntity.ok().build();
        } finally {
            em.close();
        }
    }

    // Hồ sơ bệnh án: xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicalRecord(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            MedicalRecord existingRecord = medicalRecordRepo.findById(em, id);
            if (existingRecord == null) {
                if (em.getTransaction().isActive()) {
                    em.getTransaction().rollback();
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay ho so benh an");
            }
            medicalRecordRepo.deleteById(em, id);
            em.getTransaction().commit();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            return ResponseEntity.badRequest().body("Loi xoa ho so: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    private void validateMedicalRecordPayload(MedicalRecordDto dto, boolean requireAppointmentId) {
        if (dto == null) {
            throw new IllegalArgumentException("Du lieu ho so benh an rong");
        }
        if (requireAppointmentId && dto.getAppointmentId() == null) {
            throw new IllegalArgumentException("AppointmentId khong duoc de trong");
        }
        if (dto.getSymptoms() == null || dto.getSymptoms().isBlank()) {
            throw new IllegalArgumentException("Trieu chung khong duoc de trong");
        }
        if (!requireAppointmentId && (dto.getDiagnosis() == null || dto.getDiagnosis().isBlank())) {
            throw new IllegalArgumentException("Chan doan khong duoc de trong");
        }
    }
}
