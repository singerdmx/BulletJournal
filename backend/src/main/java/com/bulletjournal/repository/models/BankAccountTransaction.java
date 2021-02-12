package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "bank_account_transactions")
public class BankAccountTransaction extends AuditModel {
    @Id
    @GeneratedValue(generator = "bank_account_transaction_generator")
    @SequenceGenerator(name = "bank_account_transaction_generator", sequenceName = "public.bank_account_transactions_sequence", allocationSize = 2, initialValue = 100)
    private Long id;

    @Column(name = "description", length = 600)
    private String description;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
