package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.TaskAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskAuditableRepository extends PagingAndSortingRepository<TaskAuditable, Long> {
  Page<TaskAuditable> findAllByTask(Task task, Pageable pageable);
}
