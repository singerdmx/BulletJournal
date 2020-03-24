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
public interface TransactionRepository extends JpaRepository<Transaction, Long>, TransactionRepositoryCustom {
    @Query("SELECT transaction FROM Transaction transaction where transaction.project = :project AND " +
            "((transaction.startTime >= :startTime AND transaction.startTime <= :endTime) OR " +
            "(transaction.endTime >= :startTime AND transaction.endTime <= :endTime))")
    List<Transaction> findTransactionsByProjectBetween(@Param("project") Project project,
                                                       @Param("startTime") Timestamp startTime,
                                                       @Param("endTime") Timestamp endTime);

    @Query("SELECT transaction FROM Transaction transaction where transaction.payer = :payer AND" +
            "((transaction.startTime >= :startTime AND transaction.startTime <= :endTime) OR " +
            "(transaction.endTime >= :startTime AND transaction.endTime <= :endTime))")
    List<Transaction> findTransactionsOfPayerBetween(@Param("payer") String payer,
                                                     @Param("startTime") Timestamp startTime,
                                                     @Param("endTime") Timestamp endTime);
}