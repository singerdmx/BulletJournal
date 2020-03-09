package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Task;
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
        Query query = entityManager.createNativeQuery("SELECT * FROM tasks WHERE ? =  ANY(tasks.labels)", Task.class);
        query.setParameter(1, labelId);
        return query.getResultList();
    }

    @Override
    public List<Task> findTasksByLabelIds(List<Long> labelIds) {
        String queryString = "SELECT * FROM tasks WHERE ? =  ANY(tasks.labels)";
        for (int i = 1; i < labelIds.size(); i++) {
            queryString = queryString + " and ? = ANY(tasks.labels)";
        }
        Query query = entityManager.createNativeQuery(queryString, Task.class);
        for (int i = 1; i <= labelIds.size(); i++) {
            query.setParameter(i, labelIds.get(i - 1));
        }
        return query.getResultList();
    }
}
