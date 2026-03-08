package com.dao.impl;

import com.dao.IDoctorRepository;
import com.model.entity.Doctor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

import java.util.List;

public class DoctorRepository implements IDoctorRepository {
    @Override public List<Doctor> findAll(EntityManager em) {
        return em.createQuery(
                "select d from Doctor d join fetch d.department order by d.id",
                Doctor.class
        ).getResultList();
    }

    @Override public Doctor save(EntityManager em,Doctor doc) {
        if(doc.getId() == null)
        {
            em.persist(doc);
            return doc;
        }
        return em.merge(doc);
    }

    @Override public boolean existsByEmail(EntityManager em, String email) {
        if (email == null) return false;
        Long cnt = em.createQuery(
                        "select count(d) from Doctor d where lower(d.email) = lower(:email)",
                        Long.class
                ).setParameter("email", email)
                .getSingleResult();
        return cnt != null && cnt > 0;
    }

    @Override public boolean existsByPhone(EntityManager em, String phone) {
        if (phone == null) return false;
        Long cnt = em.createQuery(
                        "select count(d) from Doctor d where d.phone = :phone",
                        Long.class
                ).setParameter("phone", phone)
                .getSingleResult();
        return cnt != null && cnt > 0;
    }

    @Override public Doctor findById(EntityManager em, int id) {
        try {
            return em.createQuery(
                            "SELECT d FROM Doctor d WHERE d.id = :id", Doctor.class
                    )
                    .setParameter("id", id)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override public Doctor update(EntityManager em, Doctor doctor) {
        if (doctor == null || doctor.getId() == null) {
            throw new IllegalArgumentException("Doctor hoặc id rỗng");
        }

        // Không mở/đóng transaction ở repo!
        Doctor managed = em.find(Doctor.class, doctor.getId());
        if (managed == null) {
            throw new IllegalArgumentException("Doctor không tồn tại (id=" + doctor.getId() + ")");
        }

        // Sao chép các trường được phép sửa (đã được validate ở Service)
        managed.setFullName(doctor.getFullName());
        managed.setGender(doctor.getGender());
        managed.setDateOfBirth(doctor.getDateOfBirth());
        managed.setPhone(doctor.getPhone());
        managed.setEmail(doctor.getEmail());
        managed.setAddress(doctor.getAddress());
        managed.setConsultationFee(doctor.getConsultationFee());
        managed.setStatus(doctor.getStatus());
        managed.setNotes(doctor.getNotes());

        if (doctor.getDepartment() != null) {
            managed.setDepartment(doctor.getDepartment());
        }

        return em.merge(managed);
    }

    @Override public long countAll(EntityManager em) {
        return em.createQuery(
                "select count(d) from Doctor d",
                Long.class
        ).getSingleResult();
    }

    @Override public long countByStatus(EntityManager em,
                                        com.model.enums.DoctorStatus status) {

        return em.createQuery(
                        "select count(d) from Doctor d where d.status = :st",
                        Long.class
                )
                .setParameter("st", status)
                .getSingleResult();
    }

    @Override public Doctor findByPhone(EntityManager em, String phone) {
        try {
            return em.createQuery(
                            "SELECT d FROM Doctor d WHERE d.phone = :phone", Doctor.class
                    )
                    .setParameter("phone", phone)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
