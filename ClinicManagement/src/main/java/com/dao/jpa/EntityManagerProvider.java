package com.dao.jpa;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class  EntityManagerProvider{
    private static final EntityManagerFactory EMF =
            Persistence.createEntityManagerFactory("clinicDB");

    private EntityManagerProvider() {}

    public static EntityManager em(){
        return EMF.createEntityManager();
    }

    public static void init() { EMF.isOpen(); }

    public static void close()
    {
        if(EMF.isOpen()) EMF.close();
    }

}
