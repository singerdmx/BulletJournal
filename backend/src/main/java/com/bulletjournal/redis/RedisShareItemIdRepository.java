package com.bulletjournal.redis;

import com.bulletjournal.redis.models.ShareItemIds;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisShareItemIdRepository extends CrudRepository<ShareItemIds, String> {
}

