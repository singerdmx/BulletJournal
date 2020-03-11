package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findTransactionsByProject(Project project);

    @Query("SELECT transaction FROM Transaction transaction where " +
            "((transaction.startTime >= :startTime AND transaction.startTime <= :endTime) OR " +
            "(transaction.endTime >= :startTime AND transaction.endTime <= :endTime)) AND " +
            "transaction.payer = :payer")
    List<Transaction> findTransactionsOfPayerBetween(@Param("payer") String payer,
                                                     @Param("startTime") Timestamp startTime,
                                                     @Param("endTime") Timestamp endTime);
}