package com.bulletjournal.redis;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisLockedIPRepository extends CrudRepository<LockedIP, String> {
}
