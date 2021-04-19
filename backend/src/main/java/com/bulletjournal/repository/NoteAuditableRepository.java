package com.bulletjournal.repository;

import com.bulletjournal.repository.models.NoteAuditable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteAuditableRepository extends JpaRepository<NoteAuditable, Long> {
}
