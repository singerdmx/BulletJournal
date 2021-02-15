package com.bulletjournal.repository;

import com.bulletjournal.repository.models.BankAccount;
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
    @Query(value = "SELECT DISTINCT unnest(labels) AS uniqueLabels FROM transactions WHERE transactions.project_id = :project_id", nativeQuery = true)
    List<Long> findUniqueLabelsByProject(@Param("project_id") Long projectId);

    @Query("SELECT transaction FROM Transaction transaction where transaction.project = :project AND "
            + "((transaction.startTime IS NOT NULL AND transaction.startTime >= :startTime AND transaction.startTime <= :endTime) OR "
            + "(transaction.endTime IS NOT NULL AND transaction.endTime >= :startTime AND transaction.endTime <= :endTime))")
    List<Transaction> findTransactionsByProjectBetween(@Param("project") Project project,
                                                       @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime);

    @Query("SELECT transaction FROM Transaction transaction where transaction.project IN :projects AND transaction.payer = :payer AND "
            + "((transaction.startTime IS NOT NULL AND transaction.startTime >= :startTime AND transaction.startTime <= :endTime) OR "
            + "(transaction.endTime IS NOT NULL AND transaction.endTime >= :startTime AND transaction.endTime <= :endTime))")
    List<Transaction> findTransactionsOfPayerBetween(@Param("payer") String payer,
                                                     @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime,
                                                     @Param("projects") List<Project> projects);

    @Query("SELECT transaction FROM Transaction transaction where transaction.project = :project AND transaction.payer = :payer AND "
            + "((transaction.startTime IS NOT NULL AND transaction.startTime >= :startTime AND transaction.startTime <= :endTime) OR "
            + "(transaction.endTime IS NOT NULL AND transaction.endTime >= :startTime AND transaction.endTime <= :endTime))")
    List<Transaction> findTransactionsInProjectByPayerBetween(@Param("payer") String payer,
                                                              @Param("project") Project project, @Param("startTime") Timestamp startTime,
                                                              @Param("endTime") Timestamp endTime);


    @Query(value = "SELECT transaction FROM Transaction transaction WHERE " +
            "transaction.project IN (:projects) AND transaction.updatedAt >= :startTime AND transaction.updatedAt <= :endTime")
    List<Transaction> findTransactionsBetween(@Param("startTime") Timestamp startTime,
                                              @Param("endTime") Timestamp endTime,
                                              @Param("projects") List<Project> projects);

    @Query("SELECT transaction FROM Transaction transaction where transaction.project = :project AND "
            + "transaction.recurrenceRule IS NOT NULL")
    List<Transaction> findRecurringTransactionsByProject(@Param("project") Project project);

    @Query(value = "SELECT transaction FROM Transaction transaction WHERE transaction.payer = :payer AND " +
            "transaction.project IN (:projects) AND transaction.recurrenceRule IS NOT NULL")
    List<Transaction> findRecurringTransactionsOfPayer(@Param("payer") String payer, @Param("projects") List<Project> projects);

    @Query("SELECT transaction FROM Transaction transaction where transaction.project = :project AND transaction.payer = :payer AND "
            + "transaction.recurrenceRule IS NOT NULL")
    List<Transaction> findRecurringTransactionsInProjectByPayer(@Param("payer") String payer, @Param("project") Project project);

    @Query(value = "SELECT transaction FROM Transaction transaction WHERE " +
            "transaction.project IN (:projects) AND transaction.recurrenceRule IS NOT NULL")
    List<Transaction> findRecurringTransactions(@Param("projects") List<Project> projects);

    @Query(value = "SELECT  SUM(total) total FROM (SELECT COALESCE(SUM(amount), 0) total FROM transactions " +
            "WHERE transactions.bank_account = :bank_account AND transactions.transaction_type = 0" +
            " AND transactions.recurrence_rule IS NULL" +
            " UNION ALL " +
            "SELECT COALESCE(SUM(-amount), 0) total FROM transactions WHERE transactions.bank_account = :bank_account" +
            " AND transactions.transaction_type = 1 AND transactions.recurrence_rule IS NULL) s", nativeQuery = true)
    double getTransactionsAmountSumByBankAccount(@Param("bank_account") Long bankAccount);

    @Query(value = "SELECT transaction FROM Transaction transaction WHERE "
            + "transaction.bankAccount = :bankAccount AND transaction.recurrenceRule IS NULL AND "
            + "((transaction.startTime IS NOT NULL AND transaction.startTime >= :startTime AND transaction.startTime <= :endTime) OR "
            + "(transaction.endTime IS NOT NULL AND transaction.endTime >= :startTime AND transaction.endTime <= :endTime))")
    List<Transaction> findByBankAccountAndRecurrenceRuleNull(
            @Param("startTime") Timestamp startTime,
            @Param("endTime") Timestamp endTime,
            @Param("bankAccount") BankAccount bankAccount);

    @Query(value = "SELECT transaction FROM Transaction transaction WHERE "
            + "transaction.bankAccount = :bankAccount AND transaction.recurrenceRule IS NOT NULL")
    List<Transaction> findByBankAccountAndRecurrenceRuleNotNull(@Param("bankAccount") BankAccount bankAccount);

    List<Transaction> findByBankAccount(BankAccount bankAccount);
}