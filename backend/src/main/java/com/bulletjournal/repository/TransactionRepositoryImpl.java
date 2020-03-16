package com.bulletjournal.repository;


import com.bulletjournal.repository.models.Transaction;
import com.google.common.collect.ImmutableList;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class TransactionRepositoryImpl implements TransactionRepositoryCustom {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<Transaction> findTransactionsByLabelIds(List<Long> labelIds) {
        StringBuilder queryString = new StringBuilder("SELECT * FROM transactions WHERE ? = ANY(transactions.labels)");
        for (int i = 1; i < labelIds.size(); i++) {
            queryString.append(" and ? = ANY(transactions.labels)");
        }
        Query query = entityManager.createNativeQuery(queryString.toString(), Transaction.class);
        for (int i = 1; i <= labelIds.size(); i++) {
            query.setParameter(i, labelIds.get(i - 1));
        }
        return query.getResultList();
    }

    @Override
    public List<Transaction> findTransactionsByLabelId(Long labelId) {
        return findTransactionsByLabelIds(ImmutableList.of(labelId));
    }
}
