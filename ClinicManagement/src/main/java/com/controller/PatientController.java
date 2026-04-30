package com.controller;

import com.dao.impl.AppointmentRepository;
import com.dao.impl.InvoiceRepository;
import com.dao.impl.MedicalRecordRepository;
import com.dao.impl.PatientRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.AppointmentDto;
import com.model.dto.InvoiceDto;
import com.model.dto.MedicalRecordDto;
import com.model.dto.PatientDashboardDto;
import com.model.dto.PatientDto;
import com.model.entity.*;
import com.model.enums.AppointmentStatus;
import com.model.enums.InvoiceStatus;
import com.model.mapper.AppointmentMapper;
import com.model.mapper.InvoiceMapper;
import com.model.mapper.MedicalRecordMapper;
import com.model.mapper.PatientMapper;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepo = new PatientRepository();
    private final AppointmentRepository appointmentRepo = new AppointmentRepository();
    private final MedicalRecordRepository medicalRecordRepo = new MedicalRecordRepository();
    private final InvoiceRepository invoiceRepo = new InvoiceRepository();
    private final MedicalRecordMapper medicalRecordMapper = new MedicalRecordMapper();
    private final InvoiceMapper invoiceMapper = new InvoiceMapper();

    @GetMapping
    public ResponseEntity<List<PatientDto>> getPatients(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String phone) {
        EntityManager em = EntityManagerProvider.em();
        try {
            List<PatientDto> patients = patientRepo.findAll(em).stream()
                    .map(PatientMapper::toDto)
                    .filter(dto -> filterPatient(dto, search, phone))
                    .sorted(Comparator.comparing(dto -> safe(dto.getFullName())))
                    .toList();
            return ResponseEntity.ok(patients);
        } finally {
            em.close();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatient(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            return patientRepo.findById(em, id)
                    .<ResponseEntity<?>>map(patient -> ResponseEntity.ok(PatientMapper.toDto(patient)))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay benh nhan"));
        } finally {
            em.close();
        }
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<?> getPatientDashboard(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            Patient patient = patientRepo.findById(em, id).orElse(null);
            if (patient == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay benh nhan");
            }

            LocalDateTime now = LocalDateTime.now();
            PatientDashboardDto dto = new PatientDashboardDto();
            dto.setPatientId(patient.getId());
            dto.setPatientName(patient.getFullName());

            Long upcomingCount = appointmentRepo.countUpcomingByPatientId(em, id, now);
            dto.setUpcomingAppointmentsCount(upcomingCount == null ? 0L : upcomingCount);

            Long unpaidCount = invoiceRepo.countUnpaidByPatientId(em, id);
            dto.setUnpaidInvoicesCount(unpaidCount == null ? 0L : unpaidCount);

            Double unpaidTotal = invoiceRepo.sumUnpaidByPatientId(em, id);
            dto.setUnpaidInvoicesTotal(unpaidTotal == null ? 0.0 : unpaidTotal);

            List<MedicalRecord> records = medicalRecordRepo.findByPatientId(em, id);
            dto.setTotalMedicalRecords(records == null ? 0L : records.size());

            List<Appointment> upcomingAppts = appointmentRepo.findUpcomingByPatientId(em, id, now, 5);
            dto.setUpcomingAppointments(upcomingAppts == null ? List.of() : AppointmentMapper.toDtoList(upcomingAppts));

            List<Invoice> recentInvoices = invoiceRepo.findByPatientId(em, id);
            if (recentInvoices != null) {
                dto.setRecentInvoices(invoiceMapper.toDtoList(recentInvoices.stream().limit(5).toList()));
            } else {
                dto.setRecentInvoices(List.of());
            }

            MedicalRecord latestRecord = medicalRecordRepo.findLatestByPatientId(em, id);
            dto.setLatestMedicalRecord(latestRecord == null ? null : MedicalRecordMapper.toDto(latestRecord));

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi Backend Java: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    @GetMapping("/{id}/appointments")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            if (patientRepo.findById(em, id).isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay benh nhan");
            }
            return ResponseEntity.ok(AppointmentMapper.toDtoList(appointmentRepo.findByPatientId(em, id)));
        } finally {
            em.close();
        }
    }

    @PostMapping("/{id}/appointments")
    public ResponseEntity<?> createPatientAppointment(@PathVariable Integer id, @RequestBody AppointmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Patient patient = patientRepo.findById(em, id).orElse(null);
            if (patient == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay benh nhan");
            }
            if (dto == null || dto.getDepartmentId() == null || dto.getStartTime() == null) {
                return ResponseEntity.badRequest().body("DepartmentId va startTime khong duoc de trong");
            }

            Department department = em.find(Department.class, dto.getDepartmentId());
            if (department == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay khoa");
            }

            Doctor doctor = dto.getDoctorId() == null ? null : em.find(Doctor.class, dto.getDoctorId());
            if (dto.getDoctorId() != null && doctor == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay bac si");
            }

            Appointment appointment = new Appointment();
            appointment.setPatient(patient);
            appointment.setDepartment(department);
            appointment.setDoctor(doctor);
            appointment.setStartTime(dto.getStartTime());
            appointment.setAppointment_date(dto.getStartTime().toLocalDate());
            appointment.setReason(dto.getReason());
            appointment.setStatus(dto.getStatus() == null ? AppointmentStatus.PENDING : dto.getStatus());
            appointmentRepo.save(em, appointment);
            em.flush();

            Invoice invoice = new Invoice();
            invoice.setAppointment(appointment);
            invoice.setPatient(patient);
            invoice.setTotal(resolveConsultationFee(department, doctor));
            invoice.setDetails("Phi kham cho lich hen #" + appointment.getId());
            invoiceRepo.save(em, invoice);

            em.getTransaction().commit();
            return ResponseEntity.status(HttpStatus.CREATED).body(AppointmentMapper.toDto(appointment));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @PutMapping("/{patientId}/appointments/{appointmentId}/cancel")
    public ResponseEntity<?> cancelPatientAppointment(@PathVariable Integer patientId, @PathVariable Integer appointmentId) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment appointment = appointmentRepo.findById(em, appointmentId);
            if (appointment == null || appointment.getPatient() == null || !patientId.equals(appointment.getPatient().getId())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay lich hen");
            }
            appointment.setStatus(AppointmentStatus.CANCELED);
            appointmentRepo.save(em, appointment);
            em.getTransaction().commit();
            return ResponseEntity.ok(AppointmentMapper.toDto(appointment));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @GetMapping("/{id}/medical-records")
    public ResponseEntity<?> getPatientMedicalRecords(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            if (patientRepo.findById(em, id).isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay benh nhan");
            }
            List<MedicalRecordDto> records = medicalRecordMapper.toDtoList(medicalRecordRepo.findByPatientId(em, id));
            return ResponseEntity.ok(records);
        } finally {
            em.close();
        }
    }

    @GetMapping("/{id}/invoices")
    public ResponseEntity<?> getPatientInvoices(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            if (patientRepo.findById(em, id).isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay benh nhan");
            }
            List<InvoiceDto> invoices = invoiceMapper.toDtoList(invoiceRepo.findByPatientId(em, id));
            return ResponseEntity.ok(invoices);
        } finally {
            em.close();
        }
    }

    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody PatientDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            validatePatientForCreate(em, dto);
            Patient saved = patientRepo.create(em, PatientMapper.toEntity(dto));
            em.getTransaction().commit();
            return ResponseEntity.status(HttpStatus.CREATED).body(PatientMapper.toDto(saved));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Integer id, @RequestBody PatientDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Patient patient = patientRepo.findById(em, id).orElse(null);
            if (patient == null) {
                rollback(em);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay benh nhan");
            }
            validatePatientForUpdate(em, id, dto, patient);
            PatientMapper.patchEntity(dto, patient);
            Patient updated = patientRepo.update(em, patient);
            em.getTransaction().commit();
            return ResponseEntity.ok(PatientMapper.toDto(updated));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Patient patient = patientRepo.findById(em, id).orElse(null);
            if (patient == null) {
                rollback(em);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay benh nhan");
            }
            Long appointmentCount = em.createQuery(
                            "SELECT COUNT(a) FROM Appointment a WHERE a.patient.id = :patientId",
                            Long.class
                    )
                    .setParameter("patientId", id)
                    .getSingleResult();
            Long recordCount = em.createQuery(
                            "SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.patient.id = :patientId",
                            Long.class
                    )
                    .setParameter("patientId", id)
                    .getSingleResult();
            Long invoiceCount = em.createQuery(
                            "SELECT COUNT(i) FROM Invoice i WHERE i.patient.id = :patientId",
                            Long.class
                    )
                    .setParameter("patientId", id)
                    .getSingleResult();
            if ((appointmentCount != null && appointmentCount > 0)
                    || (recordCount != null && recordCount > 0)
                    || (invoiceCount != null && invoiceCount > 0)) {
                rollback(em);
                return ResponseEntity.badRequest().body("Khong the xoa benh nhan da co du lieu lien quan");
            }
            patientRepo.deleteById(em, id);
            em.getTransaction().commit();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    private boolean filterPatient(PatientDto dto, String search, String phone) {
        if (phone != null && !phone.isBlank() && !phone.equals(dto.getPhone())) {
            return false;
        }
        if (search == null || search.isBlank()) {
            return true;
        }
        String keyword = search.trim().toLowerCase();
        return safe(dto.getFullName()).contains(keyword)
                || safe(dto.getPhone()).contains(keyword)
                || safe(dto.getEmail()).contains(keyword);
    }

    private String safe(String value) {
        return value == null ? "" : value.toLowerCase();
    }

    private void rollback(EntityManager em) {
        if (em.getTransaction().isActive()) {
            em.getTransaction().rollback();
        }
    }

    private double resolveConsultationFee(Department department, Doctor doctor) {
        if (doctor != null && doctor.getConsultationFee() != null) {
            return doctor.getConsultationFee();
        }
        return department.getBaseFee() == null ? 0.0 : department.getBaseFee();
    }

    private void validatePatientForCreate(EntityManager em, PatientDto dto) {
        if (dto == null || dto.getPhone() == null || dto.getPhone().isBlank()) {
            throw new IllegalArgumentException("So dien thoai khong duoc de trong");
        }
        validateUniquePatientFields(em, null, dto);
    }

    private void validatePatientForUpdate(EntityManager em, Integer id, PatientDto dto, Patient existing) {
        if (dto == null) {
            throw new IllegalArgumentException("Du lieu benh nhan rong");
        }
        PatientDto merged = PatientMapper.toDto(existing);
        if (dto.getFullName() != null) merged.setFullName(dto.getFullName());
        if (dto.getGender() != null) merged.setGender(dto.getGender());
        if (dto.getDateOfBirth() != null) merged.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getPhone() != null) merged.setPhone(dto.getPhone());
        if (dto.getEmail() != null) merged.setEmail(dto.getEmail());
        if (dto.getAddress() != null) merged.setAddress(dto.getAddress());
        if (dto.getCccd() != null) merged.setCccd(dto.getCccd());
        if (dto.getInsuranceCode() != null) merged.setInsuranceCode(dto.getInsuranceCode());
        if (merged.getPhone() == null || merged.getPhone().isBlank()) {
            throw new IllegalArgumentException("So dien thoai khong duoc de trong");
        }
        validateUniquePatientFields(em, id, merged);
    }

    private void validateUniquePatientFields(EntityManager em, Integer id, PatientDto dto) {
        if (existsPatientField(em, "phone", dto.getPhone(), id)) {
            throw new IllegalArgumentException("So dien thoai da ton tai");
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank() && existsPatientField(em, "email", dto.getEmail(), id)) {
            throw new IllegalArgumentException("Email da ton tai");
        }
        if (dto.getCccd() != null && !dto.getCccd().isBlank() && existsPatientField(em, "cccd", dto.getCccd(), id)) {
            throw new IllegalArgumentException("CCCD da ton tai");
        }
        if (dto.getInsuranceCode() != null && !dto.getInsuranceCode().isBlank()
                && existsPatientField(em, "insuranceCode", dto.getInsuranceCode(), id)) {
            throw new IllegalArgumentException("Ma bao hiem da ton tai");
        }
    }

    private boolean existsPatientField(EntityManager em, String fieldName, String value, Integer id) {
        String jpql = "SELECT COUNT(p) FROM Patient p WHERE p." + fieldName + " = :value"
                + (id != null ? " AND p.id <> :id" : "");
        var query = em.createQuery(jpql, Long.class).setParameter("value", value);
        if (id != null) {
            query.setParameter("id", id);
        }
        Long count = query.getSingleResult();
        return count != null && count > 0;
    }

    @PutMapping("/{patientId}/appointments/{appointmentId}")
    public ResponseEntity<?> updatePatientAppointment(
            @PathVariable Integer patientId,
            @PathVariable Integer appointmentId,
            @RequestBody AppointmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment appointment = appointmentRepo.findById(em, appointmentId);

            if (appointment == null || !appointment.getPatient().getId().equals(patientId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy lịch hẹn");
            }
            if (appointment.getStatus() != AppointmentStatus.PENDING) {
                return ResponseEntity.badRequest().body("Chỉ có thể sửa lịch hẹn khi đang ở trạng thái PENDING");
            }

            if (dto.getStartTime() != null) {
                appointment.setStartTime(dto.getStartTime());
                appointment.setAppointment_date(dto.getStartTime().toLocalDate());
            }
            if (dto.getReason() != null) appointment.setReason(dto.getReason());

            appointmentRepo.save(em, appointment);
            em.getTransaction().commit();
            return ResponseEntity.ok(AppointmentMapper.toDto(appointment));
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }

    @PutMapping("/{patientId}/invoices/{invoiceId}/pay")
    public ResponseEntity<?> payInvoice(@PathVariable Integer patientId, @PathVariable Integer invoiceId) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Invoice invoice = em.find(Invoice.class, invoiceId);

            if (invoice == null || !invoice.getPatient().getId().equals(patientId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy hóa đơn");
            }

            invoice.setStatus(InvoiceStatus.PAID);
            em.merge(invoice);
            em.getTransaction().commit();
            return ResponseEntity.ok("Thanh toán thành công");
        } catch (Exception e) {
            rollback(em);
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            em.close();
        }
    }
}
