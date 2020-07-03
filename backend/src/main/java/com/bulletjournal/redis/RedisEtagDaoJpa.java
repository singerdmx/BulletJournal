package com.bulletjournal.redis;

import com.bulletjournal.redis.models.Etag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RedisEtagDaoJpa {

    @Autowired
    private RedisEtagRepository redisEtagRepository;

    /**
     * Batch create a list of eTags instance in Redis Cache
     * @param eTags list of eTags
     */
    public void create(List<Etag> eTags) {
        redisEtagRepository.saveAll(eTags);
    }
}
