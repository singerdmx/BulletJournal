package com.bulletjournal.repository.models;

import com.bulletjournal.ledger.BankAccountType;
import com.bulletjournal.repository.BankAccountDaoJpa;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "bank_accounts")
public class BankAccount extends OwnedModel {
    @Id
    @GeneratedValue(generator = "bank_account_generator")
    @SequenceGenerator(name = "bank_account_generator", sequenceName = "public.bank_account_sequence", allocationSize = 2, initialValue = 100)
    private Long id;

    @Column(name = "account_number")
    @Size(max = 50)
    private String accountNumber;

    @Column(name = "description", length = 600)
    private String description;

    @NotNull
    @Column(name = "account_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private BankAccountType accountType;

    /**
     * netBalance stores balance accumulated in bank_account_transactions table
     */
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

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
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

    public com.bulletjournal.controller.models.BankAccount toPresentationModel() {
        return new com.bulletjournal.controller.models.BankAccount(
                this.getId(),
                this.getName(),
                new com.bulletjournal.controller.models.User(this.getOwner()),
                this.getAccountNumber(),
                this.getDescription(),
                this.getAccountType(),
                this.getNetBalance()
        );
    }

    public com.bulletjournal.controller.models.BankAccount toPresentationModel(BankAccountDaoJpa bankAccountDaoJpa) {
        return new com.bulletjournal.controller.models.BankAccount(
                this.getId(),
                this.getName(),
                new com.bulletjournal.controller.models.User(this.getOwner()),
                this.getAccountNumber(),
                this.getDescription(),
                this.getAccountType(),
                bankAccountDaoJpa.getBankAccountBalance(this.getId())
        );
    }
}
