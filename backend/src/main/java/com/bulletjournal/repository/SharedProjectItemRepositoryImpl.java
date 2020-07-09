package com.bulletjournal.repository;


import com.bulletjournal.repository.models.SharedProjectItem;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class SharedProjectItemRepositoryImpl implements SharedProjectItemRepositoryCustom {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<SharedProjectItem> findSharedProjectItemsByLabelIds(String username, List<Long> labelIds) {
        StringBuilder queryString = new StringBuilder("SELECT * FROM shared_project_items WHERE " +
                "shared_project_items.username = '" + username + "' AND ? = ANY(shared_project_items.labels)");
        for (int i = 1; i < labelIds.size(); i++) {
            queryString.append(" and ? = ANY(shared_project_items.labels)");
        }
        Query query = entityManager.createNativeQuery(queryString.toString(), SharedProjectItem.class);
        for (int i = 1; i <= labelIds.size(); i++) {
            query.setParameter(i, labelIds.get(i - 1));
        }
        return query.getResultList();
    }
}
