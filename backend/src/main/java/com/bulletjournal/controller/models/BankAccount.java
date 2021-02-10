package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.ledger.BankAccountType;
import org.apache.commons.lang3.StringUtils;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Objects;

public class BankAccount {

    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    protected String name;

    @NotNull
    protected User owner;

    @Size(max = 50)
    private String accountNumber;

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
            String accountNumber,
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

    public static List<BankAccount> addOwnerAvatar(List<BankAccount> bankAccounts, UserClient userClient) {
        if (bankAccounts == null) {
            return null;
        }
        bankAccounts.forEach(bankAccount -> addOwnerAvatar(bankAccount, userClient));
        return bankAccounts;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BankAccount that = (BankAccount) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getName(), that.getName()) &&
                Objects.equals(getOwner(), that.getOwner()) &&
                Objects.equals(getAccountNumber(), that.getAccountNumber()) &&
                Objects.equals(getDescription(), that.getDescription()) &&
                getAccountType() == that.getAccountType() &&
                Objects.equals(getNetBalance(), that.getNetBalance());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getOwner(),
                getAccountNumber(), getDescription(), getAccountType(), getNetBalance());
    }
}
