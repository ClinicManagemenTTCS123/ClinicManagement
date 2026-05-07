package com.service.impl;

import com.dao.impl.DoctorRepository;
import com.dao.impl.UserRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.RegisterRequest;
import com.model.dto.UserDto;
import com.model.entity.Doctor;
import com.model.entity.Patient;
import com.model.entity.User;
import com.model.enums.UserRole;
import com.service.IUserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

import static org.apache.logging.log4j.util.Strings.isBlank;

public class UserService implements IUserService {

    private final DoctorRepository doctorRepository = new DoctorRepository();

    @Override
    public User login(String username, String password) throws Exception {
        EntityManager em = EntityManagerProvider.em();
        try {
            if (isBlank(username) || isBlank(password)) {
                throw new Exception("Tên đăng nhập và mật khẩu không được để trống!");
            }

            UserRepository userDAO = new UserRepository();
            User user = userDAO.getUserbyUsername(em, username);
            if (user == null || !user.getPassword().equals(password)) {
                throw new Exception("Tài khoản hoặc mật khẩu không chính xác.");
            }

            return user;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public boolean register(RegisterRequest request) throws Exception {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();

            String username = request.getUsername();
            String pass = request.getPassword();
            String confirmPass = request.getConfirmPassword();
            String fullName = request.getFullName();
            String email = request.getEmail();

            if (isBlank(username) || isBlank(pass) || isBlank(confirmPass) || isBlank(fullName)) {
                throw new Exception("Vui lòng nhập đầy đủ thông tin bắt buộc (Họ tên, Tài khoản, Mật khẩu).");
            }
            if (!pass.equals(confirmPass)) {
                throw new Exception("Mật khẩu không khớp.");
            }

            UserRepository userRepositoryImp = new UserRepository();
            User existing = userRepositoryImp.getUserbyUsername(em, username);
            if (existing != null) {
                throw new Exception("Tên đăng nhập đã tồn tại.");
            }

            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(pass);
            newUser.setActive(true);
            newUser.setRole(UserRole.PATIENT);

            userRepositoryImp.save(em, newUser);

            Patient newPatient = new Patient();
            newPatient.setUser(newUser);
            newPatient.setFullName(fullName);
            newPatient.setEmail(email);

            em.persist(newPatient);

            em.getTransaction().commit();
            return true;

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public UserDto createOrResetDoctorAccount(Integer doctorId) throws Exception {
        EntityManager em = EntityManagerProvider.em();

        try {
            em.getTransaction().begin();

            DoctorRepository doctorRepo = new DoctorRepository();
            UserRepository userRepo = new UserRepository();

            Doctor doctor = doctorRepo.findById(em, doctorId);
            if (doctor == null)
                throw new Exception("Không tìm thấy bác sĩ với ID: " + doctorId);

            User user = userRepo.findById(em, doctor.getUser());
            String username = "";

            if (user == null) {
                username = doctor.getPhone();
            } else {
                username = user.getUsername();
            }

            String password = "123456";

            User existing = null;
            try {
                existing = userRepo.getUserbyUsername(em, username);
            } catch (NoResultException ignored) {}

            if (existing == null) {
                User newUser = new User();
                newUser.setUsername(username);
                newUser.setPassword(password);
                newUser.setActive(true);
                newUser.setRole(UserRole.DOCTOR);
                userRepo.save(em, newUser);
                doctor.setUser(newUser);
            } else {
                existing.setPassword(password);
                existing.setUsername(username);
                userRepo.update(em, existing);
            }

            em.merge(doctor);
            em.getTransaction().commit();

            UserDto dto = new UserDto();
            dto.setUsername(username);
            dto.setPassword(password);
            dto.setRole(UserRole.DOCTOR);
            dto.setActive(true);
            return dto;

        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}