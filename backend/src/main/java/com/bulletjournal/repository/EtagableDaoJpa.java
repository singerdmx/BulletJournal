package com.bulletjournal.repository;

import com.bulletjournal.repository.models.AuditModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class EtagableDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(EtagableDaoJpa.class);

    abstract <T extends AuditModel> JpaRepository<T, Long> getJpaRepository();

    public abstract List<String> findAffectedUsers(Long id);

    public abstract String getEtag(String username);
}

