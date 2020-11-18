package com.bulletjournal.redis;

import com.bulletjournal.redis.models.CachedContent;
import org.springframework.data.repository.CrudRepository;

public interface RedisCachedContentRepository extends CrudRepository<CachedContent, Long> {

}
