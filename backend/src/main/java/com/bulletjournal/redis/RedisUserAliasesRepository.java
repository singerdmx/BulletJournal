package com.bulletjournal.redis;

import com.bulletjournal.redis.models.UserAliases;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisUserAliasesRepository extends CrudRepository<UserAliases, String> {
}
