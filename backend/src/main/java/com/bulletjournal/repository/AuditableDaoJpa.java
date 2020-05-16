package com.bulletjournal.repository;

import com.bulletjournal.notifications.Auditable;
import com.bulletjournal.repository.models.Project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class AuditableDaoJpa {

    @Autowired
    private AuditableRepository auditableRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(List<Auditable> auditables) {
        List<Long> projectIds = auditables.stream().filter(s -> s.getPojectId() != null).map(s -> s.getPojectId())
                .collect(Collectors.toList());
        List<Project> projects = projectRepository.findAllById(projectIds);

        auditables.forEach(auditable -> this.auditableRepository.save(auditable.toRepositoryAuditable(
                projects.stream().filter(s -> s.getId().equals(auditable.getPojectId())).findAny().get())));

    }
}
