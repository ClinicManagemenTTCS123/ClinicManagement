package com.service;

import com.model.dto.RegisterRequest;
import com.model.dto.UserDto;
import com.model.entity.User;

public interface IUserService {
    User login(String username, String password) throws Exception;
    boolean register(RegisterRequest request) throws Exception;
    UserDto createOrResetDoctorAccount(Integer doctorId) throws Exception;
}