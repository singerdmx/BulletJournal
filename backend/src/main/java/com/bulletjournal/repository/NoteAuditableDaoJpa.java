package com.bulletjournal.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class NoteAuditableDaoJpa {

  @Autowired private NoteAuditableRepository noteAuditableRepository;

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public void create(List<com.bulletjournal.notifications.NoteAuditable> noteAuditables) {
    this.noteAuditableRepository.saveAll(
        noteAuditables.stream()
            .map(com.bulletjournal.notifications.NoteAuditable::toRepositoryAuditable)
            .collect(Collectors.toList()));
  }
}
