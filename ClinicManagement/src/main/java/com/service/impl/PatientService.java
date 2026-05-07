package com.service.impl;

import com.dao.impl.*;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.*;
import com.model.entity.*;
import com.model.enums.AppointmentStatus;
import com.model.enums.InvoiceStatus;
import com.model.mapper.*;
import com.service.IPatientService;
import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

public class PatientService implements IPatientService {

    private final PatientRepository patientRepo = new PatientRepository();
    private final AppointmentRepository appointmentRepo = new AppointmentRepository();
    private final MedicalRecordRepository medicalRecordRepo = new MedicalRecordRepository();
    private final InvoiceRepository invoiceRepo = new InvoiceRepository();
    private final MedicalRecordMapper medicalRecordMapper = new MedicalRecordMapper();
    private final InvoiceMapper invoiceMapper = new InvoiceMapper();

    @Override
    public List<PatientDto> getPatients(String search, String phone) {
        EntityManager em = EntityManagerProvider.em();
        try {
            return patientRepo.findAll(em).stream()
                    .map(PatientMapper::toDto)
                    .filter(dto -> filterPatient(dto, search, phone))
                    .sorted(Comparator.comparing(dto -> safe(dto.getFullName())))
                    .toList();
        } finally {
            em.close();
        }
    }

    @Override
    public PatientDto getPatient(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            Patient patient = patientRepo.findById(em, id)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay benh nhan"));
            return PatientMapper.toDto(patient);
        } finally {
            em.close();
        }
    }

    @Override
    public PatientDashboardDto getPatientDashboard(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            Patient patient = patientRepo.findById(em, id)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay benh nhan"));

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

            return dto;
        } finally {
            em.close();
        }
    }

    @Override
    public List<AppointmentDto> getPatientAppointments(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            if (patientRepo.findById(em, id).isEmpty()) {
                throw new IllegalArgumentException("Khong tim thay benh nhan");
            }
            return AppointmentMapper.toDtoList(appointmentRepo.findByPatientId(em, id));
        } finally {
            em.close();
        }
    }

    @Override
    public AppointmentDto createPatientAppointment(Integer id, AppointmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            Patient patient = patientRepo.findById(em, id)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay benh nhan"));

            if (dto == null || dto.getDepartmentId() == null || dto.getStartTime() == null) {
                throw new IllegalArgumentException("DepartmentId va startTime khong duoc de trong");
            }

            Department department = em.find(Department.class, dto.getDepartmentId());
            if (department == null) {
                throw new IllegalArgumentException("Khong tim thay khoa");
            }

            Doctor doctor = dto.getDoctorId() == null ? null : em.find(Doctor.class, dto.getDoctorId());
            if (dto.getDoctorId() != null && doctor == null) {
                throw new IllegalArgumentException("Khong tim thay bac si");
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
            return AppointmentMapper.toDto(appointment);
        } catch (Exception e) {
            rollback(em);
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public AppointmentDto cancelPatientAppointment(Integer patientId, Integer appointmentId) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment appointment = appointmentRepo.findById(em, appointmentId);
            if (appointment == null || appointment.getPatient() == null || !patientId.equals(appointment.getPatient().getId())) {
                throw new IllegalArgumentException("Khong tim thay lich hen");
            }
            appointment.setStatus(AppointmentStatus.CANCELED);
            appointmentRepo.save(em, appointment);
            em.getTransaction().commit();
            return AppointmentMapper.toDto(appointment);
        } catch (Exception e) {
            rollback(em);
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public List<MedicalRecordDto> getPatientMedicalRecords(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            if (patientRepo.findById(em, id).isEmpty()) {
                throw new IllegalArgumentException("Khong tim thay benh nhan");
            }
            return medicalRecordMapper.toDtoList(medicalRecordRepo.findByPatientId(em, id));
        } finally {
            em.close();
        }
    }

    @Override
    public List<InvoiceDto> getPatientInvoices(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            if (patientRepo.findById(em, id).isEmpty()) {
                throw new IllegalArgumentException("Khong tim thay benh nhan");
            }
            return invoiceMapper.toDtoList(invoiceRepo.findByPatientId(em, id));
        } finally {
            em.close();
        }
    }

    @Override
    public PatientDto createPatient(PatientDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            validatePatientForCreate(em, dto);
            Patient saved = patientRepo.create(em, PatientMapper.toEntity(dto));
            em.getTransaction().commit();
            return PatientMapper.toDto(saved);
        } catch (Exception e) {
            rollback(em);
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public PatientDto updatePatient(Integer id, PatientDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Patient patient = patientRepo.findById(em, id)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay benh nhan"));

            validatePatientForUpdate(em, id, dto, patient);
            PatientMapper.patchEntity(dto, patient);
            Patient updated = patientRepo.update(em, patient);

            em.getTransaction().commit();
            return PatientMapper.toDto(updated);
        } catch (Exception e) {
            rollback(em);
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public void deletePatient(Integer id) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Patient patient = patientRepo.findById(em, id)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay benh nhan"));

            Long appointmentCount = em.createQuery("SELECT COUNT(a) FROM Appointment a WHERE a.patient.id = :patientId", Long.class)
                    .setParameter("patientId", id).getSingleResult();
            Long recordCount = em.createQuery("SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.patient.id = :patientId", Long.class)
                    .setParameter("patientId", id).getSingleResult();
            Long invoiceCount = em.createQuery("SELECT COUNT(i) FROM Invoice i WHERE i.patient.id = :patientId", Long.class)
                    .setParameter("patientId", id).getSingleResult();

            if ((appointmentCount != null && appointmentCount > 0)
                    || (recordCount != null && recordCount > 0)
                    || (invoiceCount != null && invoiceCount > 0)) {
                throw new IllegalArgumentException("Khong the xoa benh nhan da co du lieu lien quan");
            }

            patientRepo.deleteById(em, id);
            em.getTransaction().commit();
        } catch (Exception e) {
            rollback(em);
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public AppointmentDto updatePatientAppointment(Integer patientId, Integer appointmentId, AppointmentDto dto) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Appointment appointment = appointmentRepo.findById(em, appointmentId);

            if (appointment == null || !appointment.getPatient().getId().equals(patientId)) {
                throw new IllegalArgumentException("Khong tim thay lich hen");
            }
            if (appointment.getStatus() != AppointmentStatus.PENDING) {
                throw new IllegalArgumentException("Chỉ có thể sửa lịch hẹn khi đang ở trạng thái PENDING");
            }

            if (dto.getStartTime() != null) {
                appointment.setStartTime(dto.getStartTime());
                appointment.setAppointment_date(dto.getStartTime().toLocalDate());
            }
            if (dto.getReason() != null) appointment.setReason(dto.getReason());

            appointmentRepo.save(em, appointment);
            em.getTransaction().commit();
            return AppointmentMapper.toDto(appointment);
        } catch (Exception e) {
            rollback(em);
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public void payInvoice(Integer patientId, Integer invoiceId) {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            Invoice invoice = em.find(Invoice.class, invoiceId);

            if (invoice == null || !invoice.getPatient().getId().equals(patientId)) {
                throw new IllegalArgumentException("Khong tim thay hoa don");
            }

            invoice.setStatus(InvoiceStatus.PAID);
            em.merge(invoice);
            em.getTransaction().commit();
        } catch (Exception e) {
            rollback(em);
            throw e;
        } finally {
            em.close();
        }
    }

    // --- CÁC HÀM TIỆN ÍCH (HELPER METHODS) BÊN TRONG SERVICE ---

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
}