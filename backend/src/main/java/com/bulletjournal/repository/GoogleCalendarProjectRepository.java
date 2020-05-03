package com.bulletjournal.repository;

import com.bulletjournal.repository.models.GoogleCalendarProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GoogleCalendarProjectRepository extends JpaRepository<GoogleCalendarProject, String> {
    Optional<GoogleCalendarProject> getByChannelId(String channelId);
}
