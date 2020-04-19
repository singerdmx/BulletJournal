package com.bulletjournal.repository;

import com.bulletjournal.repository.models.CompletedTask;
import com.bulletjournal.repository.models.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompletedTaskRepository extends JpaRepository<CompletedTask, Long> {
    List<CompletedTask> findCompletedTaskByProject(Project project, Pageable pageable);
}
