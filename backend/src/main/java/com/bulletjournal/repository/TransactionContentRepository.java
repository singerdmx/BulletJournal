package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Transaction;
import com.bulletjournal.repository.models.TransactionContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TransactionContentRepository extends JpaRepository<TransactionContent, Long> {
    List<TransactionContent> findTransactionContentByTransaction(Transaction transaction);

    @Query("SELECT transactionContent FROM TransactionContent transactionContent WHERE transactionContent.updatedAt >= :startTime AND transactionContent.updatedAt <= :endTime")
    List<TransactionContent> findRecentTransactionContentsBetween(@Param("startTime") Timestamp startTime,
                                                                  @Param("endTime") Timestamp endTime);
}