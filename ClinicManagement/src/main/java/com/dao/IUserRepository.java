package com.dao;

import com.model.entity.User;
import jakarta.persistence.EntityManager;

public interface IUserRepository {
    User getUserbyUsername(EntityManager em, String username);
    //String save(EntityManager em,User user);
    void save(EntityManager em,User user);
    void update(EntityManager em,User existing);

}
