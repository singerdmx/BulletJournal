package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Auditable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditableRepository extends JpaRepository<Auditable, Long> {
}
