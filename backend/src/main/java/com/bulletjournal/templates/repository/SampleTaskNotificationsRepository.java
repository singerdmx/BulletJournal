package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.SampleTaskNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SampleTaskNotificationsRepository extends JpaRepository<SampleTaskNotification, Long> {
}
