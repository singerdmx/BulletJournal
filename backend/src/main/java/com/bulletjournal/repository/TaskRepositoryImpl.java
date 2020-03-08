package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Task;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class TaskRepositoryImpl implements TaskRepositoryCustom {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<Task> findTasksByLabelId(Long labelId) {
        Query query = entityManager.createNativeQuery("SELECT task.* FROM Task task WHERE ANY(task.labels) = :labelId", Task.class);
        query.setParameter("labelId", labelId);
        return query.getResultList();
    }
}
