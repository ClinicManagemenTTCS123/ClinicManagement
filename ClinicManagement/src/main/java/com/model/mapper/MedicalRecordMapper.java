package com.model.mapper;


import com.model.dto.MedicalRecordDto;
import com.model.entity.MedicalRecord;

import java.util.List;
import java.util.stream.Collectors;

public class MedicalRecordMapper {

    public static MedicalRecordDto toDto(MedicalRecord medicalRecord) {
        if (medicalRecord == null) {
            return null;
        }

        MedicalRecordDto dto = new MedicalRecordDto();
        dto.setId(medicalRecord.getId());
        dto.setSymptoms(medicalRecord.getSymptoms());
        dto.setDiagnosis(medicalRecord.getDiagnosis());
        dto.setPrescription(medicalRecord.getPrescription());
        dto.setNotes(medicalRecord.getNotes());
        dto.setCreatedAt(medicalRecord.getCreatedAt());

        if (medicalRecord.getAppointment() != null) {
            dto.setAppointmentId(medicalRecord.getAppointment().getId());
        }

        if (medicalRecord.getPatient() != null) {
            dto.setPatientId(medicalRecord.getPatient().getId());
            dto.setPatientName(medicalRecord.getPatient().getFullName());
        }

        if (medicalRecord.getDoctor() != null) {
            dto.setDoctorId(medicalRecord.getDoctor().getId());
            dto.setDoctorName(medicalRecord.getDoctor().getFullName());

            if (medicalRecord.getDoctor().getDepartment() != null) {
                dto.setDepartmentName(medicalRecord.getDoctor().getDepartment().getName());
            } else {
                dto.setDepartmentName("(Không có khoa)");
            }
        }

        dto.setIndications(medicalRecord.getIndications());
        dto.setToothDetails(medicalRecord.getToothDetails());
        dto.setServices(medicalRecord.getServices());

        return dto;
    }

    public List<MedicalRecordDto> toDtoList(List<MedicalRecord> medicalRecords) {
        if (medicalRecords == null) {
            return null;
        }
        return medicalRecords.stream()
                .map(MedicalRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    public MedicalRecord toEntity(MedicalRecordDto dto) {
        if (dto == null) {
            return null;
        }
        MedicalRecord entity = new MedicalRecord();
        entity.setSymptoms(dto.getSymptoms());
        entity.setDiagnosis(dto.getDiagnosis());
        entity.setPrescription(dto.getPrescription());
        entity.setNotes(dto.getNotes());
        return entity;
    }

    public void updateEntityFromDto(MedicalRecordDto dto, MedicalRecord entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setSymptoms(dto.getSymptoms());
        entity.setDiagnosis(dto.getDiagnosis());
        entity.setPrescription(dto.getPrescription());
        entity.setNotes(dto.getNotes());
        entity.setIndications(dto.getIndications());
        entity.setToothDetails(dto.getToothDetails());
        entity.setServices(dto.getServices());

    }
}
