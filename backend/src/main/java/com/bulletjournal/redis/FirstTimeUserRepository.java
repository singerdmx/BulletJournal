package com.bulletjournal.redis;

import com.bulletjournal.redis.models.FirstTimeUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FirstTimeUserRepository extends CrudRepository<FirstTimeUser, String> {
}
