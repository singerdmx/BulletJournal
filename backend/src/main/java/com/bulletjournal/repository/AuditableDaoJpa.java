package com.bulletjournal.repository;

import com.bulletjournal.notifications.Auditable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class AuditableDaoJpa {

    @Autowired
    private AuditableRepository auditableRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(List<Auditable> auditables) {
        auditables.forEach(auditable -> this.auditableRepository.save(auditable.toRepositoryAuditable()));
    }
}
