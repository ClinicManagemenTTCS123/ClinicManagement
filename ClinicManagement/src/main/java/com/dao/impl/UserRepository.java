package com.dao.impl;


import com.dao.IUserRepository;
import com.model.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class UserRepository implements IUserRepository {
    @Override
    public User getUserbyUsername(EntityManager em, String username) {
        String hql =  "SELECT u FROM User u Where username = :username";
        TypedQuery<User> query =  em.createQuery(hql,User.class);
        query.setParameter("username",username);

        return query.getResultStream().findFirst().orElse(null);
    }
    @Override
    public void save(EntityManager em, User user) {
        em.persist(user);
    }

    @Override
    public void update(EntityManager em,User existing)
    {
        em.merge(existing);
    }

}
