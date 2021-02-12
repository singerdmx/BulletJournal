package com.bulletjournal.repository;

import com.bulletjournal.repository.models.BankAccount;
import com.bulletjournal.repository.models.BankAccountTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankAccountTransactionRepository extends JpaRepository<BankAccountTransaction, Long> {
    List<BankAccountTransaction> findByBankAccount(BankAccount bankAccount);
}
