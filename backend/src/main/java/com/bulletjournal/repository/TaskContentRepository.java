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

    @Query("SELECT taskContent FROM TaskContent taskContent WHERE taskContent.updatedAt >= :startTime AND taskContent.updatedAt <= :endTime")
    List<TaskContent> findRecentTaskContentsBetween(@Param("startTime") Timestamp startTime,
                                                    @Param("endTime") Timestamp endTime);

    @Query(nativeQuery = true, value = "SELECT id FROM task_contents WHERE task_contents.task_id IN (:taskIds)")
    List<Long> findAllByTaskIds(List<Long> taskIds);

    List<TaskContent> findByTaskIn(List<Task> tasks);

    @Query("SELECT taskContent FROM TaskContent taskContent WHERE taskContent.task.id IN (:taskIds) AND taskContent.owner = :username")
    List<TaskContent> findAllByTaskIdAndOwner(@Param("taskIds") List<Long> taskIds, @Param("username") String username);
}