package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, TaskRepositoryCustom {
    List<Task> findTaskByProject(Project project);

    @Query(value = "SELECT * FROM tasks WHERE :assignee = ANY(tasks.assignees)", nativeQuery = true)
    List<Task> findTasksByAssigneesAndRecurrenceRuleNotNull(String assignee);

    Optional<Task> findTaskByGoogleCalendarEventId(String googleCalendarEventId);

    @Query(value = "SELECT * FROM tasks WHERE :assignee = ANY(tasks.assignees) AND tasks.start_time IS NOT NULL AND tasks.reminder_date_time IS NOT NULL" +
            " AND tasks.start_time >= ':now' AND tasks.reminder_date_time <= ':now'", nativeQuery = true)
    List<Task> findRemindingTasks(@Param("assignee") String assignee, @Param("now") String now);

    @Query(value = "SELECT * FROM tasks WHERE :assignee = ANY(tasks.assignees) AND tasks.startTime IS NOT NULL AND " +
            "tasks.endTime IS NOT NULL AND " +
            "((tasks.startTime >= :startTime AND tasks.startTime <= :endTime) OR " +
            "(tasks.endTime >= :startTime AND tasks.endTime <= :endTime))", nativeQuery = true)
    List<Task> findTasksOfAssigneeBetween(@Param("assignee") String assignee,
                                          @Param("startTime") String startTime,
                                          @Param("endTime") String endTime);
}
