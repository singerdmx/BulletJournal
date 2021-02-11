package com.bulletjournal.controller.models;

import com.bulletjournal.ledger.BankAccountType;
import org.apache.commons.lang3.StringUtils;

public class UpdateBankAccountParams {
    protected String name;

    private String accountNumber;

    private String description;

    private BankAccountType accountType;

    private Double netBalance;

    public UpdateBankAccountParams() {

    }

    public UpdateBankAccountParams(String name, String accountNumber,
                                   String description, BankAccountType accountType,
                                   Double netBalance) {
        this.name = name;
        this.accountNumber = accountNumber;
        this.description = description;
        this.accountType = accountType;
        this.netBalance = netBalance;
    }

    public boolean hasName() {
        return StringUtils.isNotBlank(this.name);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean hasAccountNumber() {
        return StringUtils.isNotBlank(this.accountNumber);
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public boolean hasDescription() {
        return StringUtils.isNotBlank(this.description);
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean hasAccountType() {
        return this.accountType != null;
    }

    public BankAccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(BankAccountType accountType) {
        this.accountType = accountType;
    }

    public boolean hasNetBalance() {
        return this.netBalance != null;
    }

    public Double getNetBalance() {
        return netBalance;
    }

    public void setNetBalance(Double netBalance) {
        this.netBalance = netBalance;
    }
}
