package com.bulletjournal.repository;

import com.bulletjournal.repository.models.ProjectTasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectTasksRepository extends JpaRepository<ProjectTasks, Long> {
}