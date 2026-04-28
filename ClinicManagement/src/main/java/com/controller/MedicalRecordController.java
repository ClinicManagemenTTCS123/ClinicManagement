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

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepo = new MedicalRecordRepository();
    private final MedicalRecordMapper mapper = new MedicalRecordMapper();

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicalRecord(@PathVariable Integer id, @RequestBody MedicalRecordDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            MedicalRecord existingRecord = medicalRecordRepo.findById(em, id);
            if (existingRecord == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy hồ sơ bệnh án!");
            }

            System.out.println(">>> Triệu chứng gửi lên: " + dto.getSymptoms());
            System.out.println(">>> Chẩn đoán gửi lên: " + dto.getDiagnosis());

            mapper.updateEntityFromDto(dto, existingRecord);

            em.merge(existingRecord);
            em.flush();
            em.getTransaction().commit();
            return ResponseEntity.ok(mapper.toDto(existingRecord));

        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi cập nhật hồ sơ: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    @PostMapping("/upsert-exam")
    public ResponseEntity<?> upsertExamRecord(@RequestBody MedicalRecordDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            MedicalRecord record = medicalRecordRepo.findByAppointmentId(em, dto.getAppointmentId());

            if (record != null) {
                record.setSymptoms(dto.getSymptoms());
                record.setIndications(dto.getIndications());
                record.setToothDetails(dto.getToothDetails());
                record.setServices(dto.getServices());
                medicalRecordRepo.update(em, record);
            } else {
                record = new MedicalRecord();
                Appointment apt = em.find(Appointment.class, dto.getAppointmentId());
                if (apt == null) throw new Exception("Không tìm thấy lịch hẹn");

                record.setAppointment(apt);
                record.setPatient(apt.getPatient());
                record.setDoctor(apt.getDoctor());
                record.setToothDetails(dto.getToothDetails());
                record.setServices(dto.getServices());

                record.setSymptoms(dto.getSymptoms());
                record.setIndications(dto.getIndications());
                record.setDiagnosis("Đang chờ kết quả khám");

                medicalRecordRepo.save(em, record);

                apt.setStatus(com.model.enums.AppointmentStatus.COMPLETED);
                em.merge(apt);
            }

            em.getTransaction().commit();
            return ResponseEntity.ok(mapper.toDto(record));

        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi lưu hồ sơ: " + e.getMessage());
        } finally {
            em.close();
        }
    }

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
}