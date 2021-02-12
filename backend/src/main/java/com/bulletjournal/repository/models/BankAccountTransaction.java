package com.bulletjournal.repository.models;

import com.bulletjournal.ledger.TransactionType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Random;

@Entity
@Table(name = "bank_account_transactions")
public class BankAccountTransaction extends NamedModel {
    private static final Random RAND = new Random();
    @Id
    @GeneratedValue(generator = "bank_account_transaction_generator")
    @SequenceGenerator(name = "bank_account_transaction_generator", sequenceName = "public.bank_account_transactions_sequence", allocationSize = 2, initialValue = 100)
    private Long id;

    @NotNull
    @Column(nullable = false, updatable = false)
    private Double amount;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bank_account")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private BankAccount bankAccount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BankAccount getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(BankAccount bankAccount) {
        this.bankAccount = bankAccount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Transaction toTransaction() {
        Transaction t = new Transaction();
        double amount = getAmount();
        TransactionType transactionType = TransactionType.INCOME;
        if (amount < 0) {
            amount = -amount;
            transactionType = TransactionType.EXPENSE;
        }
        t.setBankAccount(getBankAccount());
        t.setAmount(amount);
        t.setPayer(getBankAccount().getOwner());
        t.setOwner(getBankAccount().getOwner());
        t.setTransactionType(transactionType);
        t.setStartTime(getCreatedAt());
        t.setEndTime(getCreatedAt());
        t.setName(getName());
        t.setId(-Math.abs(RAND.nextLong()));
        t.setCreatedAt(getCreatedAt());
        t.setUpdatedAt(getUpdatedAt());
        return t;
    }
}
