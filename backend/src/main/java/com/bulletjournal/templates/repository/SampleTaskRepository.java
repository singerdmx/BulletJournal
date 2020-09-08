package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.SampleTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SampleTaskRepository extends JpaRepository<SampleTask, Long> {
}
