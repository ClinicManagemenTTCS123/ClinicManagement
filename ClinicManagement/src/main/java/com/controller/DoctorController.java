package com.controller;

import com.dao.impl.AppointmentRepository;
import com.dao.impl.DoctorRepository;
import com.dao.impl.MedicalRecordRepository;
import com.dao.impl.PatientRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.*;
import com.model.entity.Appointment;
import com.model.entity.Doctor;
import com.model.entity.MedicalRecord;
import com.model.entity.Patient;
import com.model.mapper.AppointmentMapper;
import com.model.mapper.DoctorMapper;
import com.model.mapper.MedicalRecordMapper;
import com.model.mapper.PatientMapper;
import jakarta.persistence.EntityManager;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final AppointmentRepository appointmentRepo = new AppointmentRepository();
    private final PatientRepository patientRepo = new PatientRepository();
    private final MedicalRecordRepository medicalRecordRepo = new MedicalRecordRepository();
    private final MedicalRecordMapper medicalRecordMapper = new MedicalRecordMapper();
    private final DoctorRepository doctorRepo = new DoctorRepository();

    // Dashboard của bác sĩ
    @GetMapping("/{doctorId}/dashboard")
    public ResponseEntity<?> getDashboardStats(@PathVariable Integer doctorId) {
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

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    // Lịch hẹn của bác sĩ: xem, tìm kiếm, lọc
    @GetMapping("/{doctorId}/appointments")
    public ResponseEntity<?> getAppointments(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;

            List<Appointment> appointments = appointmentRepo.searchDoctorAppointments(
                    em, doctorId, search, status, start, end
            );
            List<AppointmentDto> dtoList = AppointmentMapper.toDtoList(appointments);

            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tải lịch hẹn: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    // Bệnh nhân của bác sĩ: tìm kiếm, xem
    @GetMapping("/{doctorId}/patients")
    public ResponseEntity<?> getPatientsByDoctor(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) String search) {

        EntityManager em = EntityManagerProvider.em();
        try {
            List<Patient> patients = patientRepo.getPatientsByDoctorId(em, doctorId, search);
            List<PatientDto> dtoList = patients.stream().map(p -> {
                PatientDto dto = PatientMapper.toDto(p);
                if (p.getMedicalRecords() != null) {
                    dto.setVisitCount(p.getMedicalRecords().size());
                    dto.setHistory(medicalRecordMapper.toDtoList(p.getMedicalRecords().stream().toList()));
                } else {
                    dto.setVisitCount(0);
                }
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tải bệnh nhân: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    // Hồ sơ bệnh án của bác sĩ: tìm kiếm, xem
    @GetMapping("/{doctorId}/medical-records")
    public ResponseEntity<?> getMedicalRecords(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        EntityManager em = EntityManagerProvider.em();
        try {
            LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;

            List<MedicalRecord> records = medicalRecordRepo.searchDoctorMedicalRecords(
                    em, doctorId, search, start, end
            );
            List<MedicalRecordDto> dtoList = medicalRecordMapper.toDtoList(records);

            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tải hồ sơ bệnh án: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    // Hồ sơ cá nhân bác sĩ: xem
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorProfile(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            Doctor doctor = doctorRepo.findById(em, id);
            if (doctor == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy thông tin bác sĩ");
            }
            return ResponseEntity.ok(DoctorMapper.toDTO(doctor));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi hệ thống: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    // Hồ sơ cá nhân bác sĩ: sửa, lưu
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctorProfile(@PathVariable Integer id, @RequestBody DoctorDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Doctor existingDoctor = doctorRepo.findById(em, id);
            if (existingDoctor == null) {
                if (em.getTransaction().isActive()) em.getTransaction().rollback();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy thông tin bác sĩ");
            }
            System.out.println(">>> Tên bác sĩ React gửi lên: " + dto.getFullName());
            System.out.println(">>> SĐT React gửi lên: " + dto.getPhone());

            if(dto.getFullName() != null) existingDoctor.setFullName(dto.getFullName());
            if(dto.getPhone() != null) existingDoctor.setPhone(dto.getPhone());
            if(dto.getEmail() != null) existingDoctor.setEmail(dto.getEmail());
            if(dto.getAddress() != null) existingDoctor.setAddress(dto.getAddress());
            if(dto.getGender() != null) existingDoctor.setGender(dto.getGender());
            if(dto.getDateOfBirth() != null) existingDoctor.setDateOfBirth(dto.getDateOfBirth());
            if(dto.getConsultationFee() != null) existingDoctor.setConsultationFee(dto.getConsultationFee());
            if(dto.getNotes() != null) existingDoctor.setNotes(dto.getNotes());
            if(dto.getDoctorStatus() != null) existingDoctor.setStatus(dto.getDoctorStatus());

            em.merge(existingDoctor);
            em.flush();

            em.getTransaction().commit();
            return ResponseEntity.ok(DoctorMapper.toDTO(existingDoctor));
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi cập nhật: " + e.getMessage());
        } finally {
            em.close();
        }
    }
}
