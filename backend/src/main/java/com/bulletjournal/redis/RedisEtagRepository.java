package com.bulletjournal.redis;

import com.bulletjournal.redis.models.Etag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisEtagRepository extends CrudRepository<Etag, String> {
    Etag findByIndex(String index);
}
