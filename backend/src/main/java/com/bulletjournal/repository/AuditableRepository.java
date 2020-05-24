package com.bulletjournal.repository;

import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.repository.models.Auditable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface AuditableRepository extends JpaRepository<Auditable, Long> {
    // specific user and action
    @Query(value = "SELECT auditable FROM Auditable auditable WHERE auditable.projectId = :projectId AND "
            + "auditable.activityTime >= :startTime AND auditable.activityTime <= :endTime AND "
            + "auditable.action = :action AND auditable.originator = :username")
    List<Auditable> findAuditablesBetween(@Param("projectId") Long projectId,
                                          @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime,
                                          @Param("action") ContentAction action, @Param("username") String username);

    // all user
    @Query(value = "SELECT auditable FROM Auditable auditable WHERE auditable.projectId = :projectId AND "
            + "auditable.activityTime >= :startTime AND auditable.activityTime <= :endTime AND "
            + "auditable.action = :action")
    List<Auditable> findAuditablesBetweenAllUsers(@Param("projectId") Long projectId,
                                                  @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime,
                                                  @Param("action") ContentAction action);

    // all action
    @Query(value = "SELECT auditable FROM Auditable auditable WHERE auditable.projectId = :projectId AND "
            + "auditable.activityTime >= :startTime AND auditable.activityTime <= :endTime AND "
            + "auditable.originator = :username")
    List<Auditable> findAuditablesBetweenAllActions(@Param("projectId") Long projectId,
                                                    @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime,
                                                    @Param("username") String username);

    // all user and all action
    @Query(value = "SELECT auditable FROM Auditable auditable WHERE auditable.projectId = :projectId AND "
            + "auditable.activityTime >= :startTime AND auditable.activityTime <= :endTime")
    List<Auditable> findAuditablesBetweenAllActionsAllUsers(@Param("projectId") Long projectId,
                                                            @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime);

    @Modifying
    @Transactional
    void deleteByUpdatedAtBefore(Timestamp expiryTime);
}
