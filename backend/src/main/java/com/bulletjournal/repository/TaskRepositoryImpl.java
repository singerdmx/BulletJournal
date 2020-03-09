package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Task;
import com.google.common.collect.ImmutableList;
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
        return findTasksByLabelIds(ImmutableList.of(labelId));
    }

    @Override
    public List<Task> findTasksByLabelIds(List<Long> labelIds) {
        StringBuilder queryString = new StringBuilder("SELECT * FROM tasks WHERE ? = ANY(tasks.labels)");
        for (int i = 1; i < labelIds.size(); i++) {
            queryString.append(" and ? = ANY(tasks.labels)");
        }
        Query query = entityManager.createNativeQuery(queryString.toString(), Task.class);
        for (int i = 1; i <= labelIds.size(); i++) {
            query.setParameter(i, labelIds.get(i - 1));
        }
        return query.getResultList();
    }
}
