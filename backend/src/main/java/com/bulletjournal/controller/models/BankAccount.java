package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.ledger.BankAccountType;
import org.apache.commons.lang3.StringUtils;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class BankAccount {

    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    protected String name;

    @NotNull
    protected User owner;

    private Integer accountNumber;

    private String description;

    @NotNull
    private BankAccountType accountType;

    @NotNull
    private Double netBalance;

    public BankAccount() {
    }

    public BankAccount(
            Long id,
            @NotBlank @Size(min = 1, max = 100) String name,
            @NotNull User owner,
            Integer accountNumber,
            String description,
            @NotNull BankAccountType accountType,
            @NotNull Double netBalance) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.accountNumber = accountNumber;
        this.description = description;
        this.accountType = accountType;
        this.netBalance = netBalance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
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

    public static BankAccount addOwnerAvatar(BankAccount bankAccount, UserClient userClient) {
        if (bankAccount == null) {
            return null;
        }
        if (bankAccount.getOwner() != null && StringUtils.isNotBlank(bankAccount.getOwner().getName())) {
            bankAccount.setOwner(userClient.getUser(bankAccount.getOwner().getName()));
        }
        return bankAccount;
    }
}
