package com.bulletjournal.redis;

import com.bulletjournal.redis.models.LockedIP;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisLockedIPRepository extends CrudRepository<LockedIP, String> {
}
