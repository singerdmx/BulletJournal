package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.TaskContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskContentRepository extends JpaRepository<TaskContent, Long> {
    List<TaskContent> findTaskContentByTask(Task task);
}