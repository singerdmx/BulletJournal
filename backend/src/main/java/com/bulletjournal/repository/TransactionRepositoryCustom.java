package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Transaction;

import java.util.List;

public interface TransactionRepositoryCustom {
    List<Transaction> findTransactionsByLabelIds(List<Long> labelIds);

    List<Transaction> findTransactionsByLabelId(Long labelId);
}
