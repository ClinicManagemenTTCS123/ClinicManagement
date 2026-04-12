package com.controller;

import com.dao.impl.MedicalRecordRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.MedicalRecordDto;
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
    public ResponseEntity<?> updateMedicalRecord(
            @PathVariable Integer id,
            @RequestBody MedicalRecordDto dto) {

        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
 
            MedicalRecord existingRecord = medicalRecordRepo.findById(em, id);
            if (existingRecord == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy hồ sơ bệnh án!");
            }

            mapper.updateEntityFromDto(dto, existingRecord);
            medicalRecordRepo.update(em, existingRecord);

            em.getTransaction().commit();
            return ResponseEntity.ok(mapper.toDto(existingRecord));

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            return ResponseEntity.badRequest().body("Lỗi cập nhật hồ sơ: " + e.getMessage());
        } finally {
            em.close();
        }
    }
}