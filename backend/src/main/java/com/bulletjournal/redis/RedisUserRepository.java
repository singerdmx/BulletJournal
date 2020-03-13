package com.bulletjournal.redis;

import com.bulletjournal.controller.models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisUserRepository extends CrudRepository<User, String> {
}
