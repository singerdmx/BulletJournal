package com.bulletjournal.repository;

import com.bulletjournal.repository.models.BankAccount;
import com.bulletjournal.repository.models.BankAccountTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface BankAccountTransactionRepository extends JpaRepository<BankAccountTransaction, Long> {
    @Query(value = "SELECT transaction FROM BankAccountTransaction transaction WHERE " +
            "transaction.bankAccount = :bankAccount" +
            " AND transaction.createdAt >= :startTime" +
            " AND transaction.createdAt <= :endTime")
    List<BankAccountTransaction> findBankAccountTransactionByBankAccountBetween(
            @Param("startTime") Timestamp startTime,
            @Param("endTime") Timestamp endTime,
            @Param("bankAccount") BankAccount bankAccount);
}
