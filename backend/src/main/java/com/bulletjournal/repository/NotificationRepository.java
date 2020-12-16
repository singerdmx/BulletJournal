package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTargetUser(String targetUser);

    long countNotificationsByTargetUser(String targetUser);

    long countNotificationsByUpdatedAtBefore(Timestamp timestamp);

    @Modifying
    @Transactional
    long deleteByUpdatedAtBefore(Timestamp expiryTime);

    @Modifying
    @Transactional
    void deleteByTargetUser(String targetUser);

}

