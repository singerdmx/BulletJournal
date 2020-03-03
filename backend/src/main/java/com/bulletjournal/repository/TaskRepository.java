package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findTaskByProject(Project project);

    @Query("SELECT task FROM Task task where (task.startTime >= :startTime AND task.startTime <= :endTime) OR " +
            "(task.endTime >= :startTime AND task.endTime <= :endTime) AND task.assignedTo = :assignee")
    List<Task> findTasksOfAssigneeBetween(@Param("assignee") String assignee,
                                          @Param("startTime") Timestamp startTime,
                                          @Param("endTime") Timestamp endTime);
}
