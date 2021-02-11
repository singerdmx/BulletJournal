package com.bulletjournal.controller.models;

import com.bulletjournal.ledger.BankAccountType;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CreateBankAccountParams {
    @NotBlank
    @Size(min = 1, max = 100)
    protected String name;

    @Size(max = 50)
    private String accountNumber;

    private String description;

    @NotNull
    private BankAccountType accountType;

    @NotNull
    private Double netBalance;

    public CreateBankAccountParams() {

    }

    public CreateBankAccountParams(@NotBlank @Size(min = 1, max = 100) String name,
                                   @Size(max = 50) String accountNumber,
                                   String description, @NotNull BankAccountType accountType,
                                   @NotNull Double netBalance) {
        this.name = name;
        this.accountNumber = accountNumber;
        this.description = description;
        this.accountType = accountType;
        this.netBalance = netBalance;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}
