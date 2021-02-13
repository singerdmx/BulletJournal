package com.bulletjournal.controller.models.params;

import javax.validation.constraints.NotNull;

public class SetBankAccountBalanceParams {

    @NotNull
    private Double balance;

    private String description;

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
