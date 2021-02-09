package com.bulletjournal.repository.models;

import com.bulletjournal.ledger.BankAccountType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "bank_accounts")
public class BankAccount extends OwnedModel {
    @Id
    @GeneratedValue(generator = "bank_account_generator")
    @SequenceGenerator(name = "bank_account_generator", sequenceName = "public.bank_account_sequence", allocationSize = 2, initialValue = 100)
    private Long id;

    @Column(name = "account_number")
    private Integer accountNumber;

    @Column(name = "description", length = 600)
    private String description;

    @NotNull
    @Column(name = "account_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private BankAccountType accountType;

    @NotNull
    @Column(name = "net_balance", nullable = false)
    private Double netBalance;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(Integer accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BankAccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(BankAccountType accountType) {
        this.accountType = accountType;
    }

    public Double getNetBalance() {
        return netBalance;
    }

    public void setNetBalance(Double netBalance) {
        this.netBalance = netBalance;
    }
}
