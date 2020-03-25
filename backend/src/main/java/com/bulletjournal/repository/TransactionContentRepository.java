package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Transaction;
import com.bulletjournal.repository.models.TransactionContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionContentRepository extends JpaRepository<TransactionContent, Long> {
    List<TransactionContent> findTransactionContentByTransaction(Transaction transaction);
}