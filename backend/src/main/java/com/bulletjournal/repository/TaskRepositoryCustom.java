package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Task;

import java.util.List;

public interface TaskRepositoryCustom {

    List<Task> findTasksByLabelId(Long labelId);
}
