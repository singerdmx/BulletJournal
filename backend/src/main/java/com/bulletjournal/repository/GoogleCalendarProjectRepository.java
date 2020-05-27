package com.bulletjournal.repository;

import com.bulletjournal.repository.models.GoogleCalendarProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoogleCalendarProjectRepository extends JpaRepository<GoogleCalendarProject, String> {
    Optional<GoogleCalendarProject> getByChannelId(String channelId);


    @Modifying
    @Transactional
    List<GoogleCalendarProject> getByExpirationBefore(Timestamp expiryTime);

    List<GoogleCalendarProject> findByOwner(String owner);
}
