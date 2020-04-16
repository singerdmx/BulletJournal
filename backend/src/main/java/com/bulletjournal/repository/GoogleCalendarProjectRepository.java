package com.bulletjournal.repository;

import com.bulletjournal.repository.models.GoogleCalendarProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoogleCalendarProjectRepository extends JpaRepository<GoogleCalendarProject, String> {
}
