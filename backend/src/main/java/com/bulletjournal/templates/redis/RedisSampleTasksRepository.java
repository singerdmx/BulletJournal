package com.bulletjournal.templates.redis;

import com.bulletjournal.templates.controller.model.SampleTasks;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisSampleTasksRepository extends CrudRepository<SampleTasks, String> {
}
