package com.bulletjournal.redis;

import com.bulletjournal.redis.models.JoinGroupNotification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisNotificationRepository extends CrudRepository<JoinGroupNotification, String> {
}

