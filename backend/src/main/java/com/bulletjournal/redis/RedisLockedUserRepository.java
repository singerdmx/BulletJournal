package com.bulletjournal.redis;

import com.bulletjournal.redis.models.LockedUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisLockedUserRepository extends CrudRepository<LockedUser, String> {
}
