package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, TaskRepositoryCustom {
    @Query(value = "SELECT DISTINCT unnest(labels) AS uniqueLabels FROM tasks WHERE tasks.project_id = :project_id", nativeQuery = true)
    List<Long> findUniqueLabelsByProject(@Param("project_id") Long projectId);

    List<Task> findTaskByProject(Project project);

    @Query(value = "SELECT * FROM tasks WHERE :assignee = ANY(tasks.assignees) AND tasks.project_id = :project_id", nativeQuery = true)
    List<Task> findTasksByAssigneeAndProject(@Param("assignee") String assignee,
                                             @Param("project_id") Long projectId);

    @Query(value = "SELECT * FROM tasks WHERE :assignee = ANY(tasks.assignees) AND tasks.recurrence_rule IS NOT NULL", nativeQuery = true)
    List<Task> findTasksByAssigneeAndRecurrenceRuleNotNull(@Param("assignee") String assignee);

    List<Task> findTasksByRecurrenceRuleNotNull();

    List<Task> findTaskByProjectAndRecurrenceRuleNotNull(Project project);

    @Query(value = "SELECT * FROM tasks WHERE tasks.start_time IS NOT NULL AND tasks.reminder_date_time IS NOT NULL"
            + " AND tasks.start_time >= to_timestamp(:start, 'YYYY-MM-DD HH24:MI:SS') AND tasks.reminder_date_time <= to_timestamp(:end, 'YYYY-MM-DD HH24:MI:SS')", nativeQuery = true)
    List<Task> findRemindingTasksBetween(@Param("start") String start, @Param("end") String end);

    Optional<Task> findTaskByGoogleCalendarEventIdAndProject(String googleCalendarEventId, Project project);

    @Query(value = "SELECT * FROM tasks WHERE :assignee = ANY(tasks.assignees) AND tasks.start_time IS NOT NULL AND tasks.reminder_date_time IS NOT NULL"
            + " AND tasks.start_time >= to_timestamp(:start, 'YYYY-MM-DD HH24:MI:SS') AND tasks.reminder_date_time <= to_timestamp(:now, 'YYYY-MM-DD HH24:MI:SS')", nativeQuery = true)
    List<Task> findRemindingTasks(@Param("assignee") String assignee, @Param("now") String now,
                                  @Param("start") String start);

    @Query(value = "SELECT * FROM tasks WHERE tasks.project_id IN :projectIds AND :assignee = ANY(tasks.assignees) AND tasks.start_time IS NOT NULL AND "
            + "tasks.end_time IS NOT NULL AND "
            + "((tasks.start_time >= to_timestamp(:startTime, 'YYYY-MM-DD HH24:MI:SS') AND tasks.start_time <= to_timestamp(:endTime, 'YYYY-MM-DD HH24:MI:SS')) OR "
            + "(tasks.end_time >= to_timestamp(:startTime, 'YYYY-MM-DD HH24:MI:SS') AND tasks.end_time <= to_timestamp(:endTime, 'YYYY-MM-DD HH24:MI:SS')))", nativeQuery = true)
    List<Task> findTasksOfAssigneeBetween(@Param("assignee") String assignee, @Param("startTime") String startTime,
                                          @Param("endTime") String endTime, @Param("projectIds") List<Long> projectIds);

    @Query(value = "SELECT task FROM Task task WHERE task.project = :project AND "
            + "task.startTime IS NOT NULL AND task.endTime IS NOT NULL AND "
            + "((task.startTime >= :startTime AND task.startTime <= :endTime) OR "
            + "(task.endTime >= :startTime AND task.endTime <= :endTime))")
    List<Task> findTasksBetween(@Param("project") Project project,
                                @Param("startTime") Timestamp startTime,
                                @Param("endTime") Timestamp endTime);

    @Query(value = "SELECT task FROM Task task WHERE " +
            "task.project IN (:projects) AND task.updatedAt >= :startTime AND task.updatedAt <= :endTime")
    List<Task> findTasksBetween(@Param("startTime") Timestamp startTime,
                                @Param("endTime") Timestamp endTime,
                                @Param("projects") List<Project> projects);

    @Query(value = "SELECT * FROM tasks WHERE tasks.project_id in :projectIds AND tasks.start_time IS NOT NULL AND " +
            "tasks.end_time IS NOT NULL AND " +
            "((tasks.start_time >= to_timestamp(:startTime, 'YYYY-MM-DD HH24:MI:SS') AND tasks.start_time <= to_timestamp(:endTime, 'YYYY-MM-DD HH24:MI:SS')) OR " +
            "(tasks.end_time >= to_timestamp(:startTime, 'YYYY-MM-DD HH24:MI:SS') AND tasks.end_time <= to_timestamp(:endTime, 'YYYY-MM-DD HH24:MI:SS')))", nativeQuery = true)
    List<Task> findTaskWithProjectIdStartTimeEndTime(List<Long> projectIds, String startTime, String endTime);

    @Query(value = "SELECT * FROM tasks WHERE tasks.project_id in :projectIds AND (tasks.end_time is NULL " +
            "OR tasks.end_time >= to_timestamp(:startTime, 'YYYY-MM-DD HH24:MI:SS'))", nativeQuery = true)
    List<Task> findTaskWithProjectIdStartTime(List<Long> projectIds, String startTime);

    @Query(value = "SELECT * FROM tasks WHERE tasks.project_id in :projectIds AND (tasks.start_time is NOT NULL " +
            "AND tasks.start_time <= to_timestamp(:endTime, 'YYYY-MM-DD HH24:MI:SS'))", nativeQuery = true)
    List<Task> findTaskWithProjectIdEndTime(List<Long> projectIds, String endTime);

    @Query(value = "SELECT * FROM tasks WHERE tasks.project_id in :projectIds", nativeQuery = true)
    List<Task> findTaskWithProjectId(List<Long> projectIds);
}
