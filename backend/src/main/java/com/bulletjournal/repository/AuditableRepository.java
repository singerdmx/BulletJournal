package com.bulletjournal.repository;

import java.sql.Timestamp;

import com.bulletjournal.repository.models.Auditable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditableRepository extends JpaRepository<Auditable, Long> {
    @Query(value = "SELECT auditable FROM Auditable auditable WHERE auditable.projectId = :projectId AND "
            + "auditable.activityTime >= :startTime AND auditable.activityTime <= :endTime")
    List<Auditable> findAuditablesBetween(@Param("projectId") Long projectId, @Param("startTime") Timestamp startTime,
            @Param("endTime") Timestamp endTime);
}
