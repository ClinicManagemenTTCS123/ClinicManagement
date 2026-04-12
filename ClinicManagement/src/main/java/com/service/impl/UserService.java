package com.service.impl;

import com.dao.impl.DoctorRepository;
import com.dao.impl.UserRepository;
import com.dao.jpa.EntityManagerProvider;
import com.model.dto.UserDto;
import com.model.entity.Doctor;
import com.model.entity.User;
import com.model.enums.UserRole;
import com.service.IUserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import org.springframework.validation.ValidationUtils;

import static com.util.ValidationUtils.isValidPhone;
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
    public boolean register(String username, String pass, String confirmpass) throws Exception {
        EntityManager em = EntityManagerProvider.em();
        try {
            em.getTransaction().begin();
            if (isBlank(username) || isBlank(pass) || isBlank(confirmpass)) {
                throw new Exception("Vui lòng nhập đầy đủ thông tin.");
            }

            if (!pass.equals(confirmpass)) {
                throw new Exception("Mật khẩu không khớp.");
            }

//            if (!isValidPhone(username)) {
//                throw new Exception("Số điện thoại không hợp lệ.");
//            }

            UserRepository userRepositoryImp = new UserRepository();
            User existing = userRepositoryImp.getUserbyUsername(em, username);
            if (existing != null) {
                throw new Exception("Tài khoản đã tồn tại.");
            }

            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(pass);
            newUser.setActive(true);
            newUser.setRole(UserRole.PATIENT);

            userRepositoryImp.save(em, newUser);
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

            // Lấy thông tin bác sĩ
            Doctor doctor = doctorRepo.findById(em, doctorId);
            if (doctor == null)
                throw new Exception("Không tìm thấy bác sĩ với ID: " + doctorId);

            if (doctor.getPhone() == null || doctor.getPhone().isBlank())
                throw new Exception("Bác sĩ chưa có số điện thoại, không thể tạo tài khoản.");

            // Username = SĐT
            String username = doctor.getPhone();

            // Password = ngày sinh (ddMMyy)
            //String password = ValidationUtils.formatDobAsPassword(Doctor.getDateOfBirth());
            String password = "";

            // Kiểm tra tài khoản
            User existing = null;
            try {
                existing = userRepo.getUserbyUsername(em, username);
            } catch (NoResultException ignored) {}

            if (existing == null) {
                // 🟢 Chưa có tài khoản → tạo mới
                User newUser = new User();
                newUser.setUsername(username);
                newUser.setPassword(password);
                newUser.setActive(true);
                newUser.setRole(UserRole.DOCTOR);
                userRepo.save(em, newUser);
            } else {
                // 🟠 Đã có → reset mật khẩu
                existing.setPassword(password);
                userRepo.update(em, existing);
            }

            em.getTransaction().commit();

            // Trả về thông tin để controller hiển thị
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
