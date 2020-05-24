package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.TaskContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TaskContentRepository extends JpaRepository<TaskContent, Long> {
    List<TaskContent> findTaskContentByTask(Task task);

    @Query("SELECT taskContent FROM TaskContent taskContent WHERE taskContent.updatedAt IS NOT NULL AND taskContent.updatedAt >= :startTime AND taskContent.updatedAt <= :endTime")
    List<TaskContent> findRecentTaskContentsBetween(@Param("startTime") Timestamp startTime,
                                                    @Param("endTime") Timestamp endTime);
}