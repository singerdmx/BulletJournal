package com.bulletjournal.controller.models;

public class TransactionsSummary {

    private String name;

    private String metadata;

    private Double income;

    private Double incomePercentage;

    private Double expense;

    private Double expensePercentage;

    private Double balance;

    private Double balancePercentage;

    public TransactionsSummary() {
    }

    public TransactionsSummary(String name, String metadata, Double income, Double incomePercentage,
                               Double expense, Double expensePercentage, Double balance, Double balancePercentage) {
        this.name = name;
        this.metadata = metadata;
        this.income = income;
        this.incomePercentage = incomePercentage;
        this.expense = expense;
        this.expensePercentage = expensePercentage;
        this.balance = balance;
        this.balancePercentage = balancePercentage;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public Double getIncome() {
        return income;
    }

    public void setIncome(Double income) {
        this.income = income;
    }

    public Double getIncomePercentage() {
        return incomePercentage;
    }

    public void setIncomePercentage(Double incomePercentage) {
        this.incomePercentage = incomePercentage;
    }

    public Double getExpense() {
        return expense;
    }

    public void setExpense(Double expense) {
        this.expense = expense;
    }

    public Double getExpensePercentage() {
        return expensePercentage;
    }

    public void setExpensePercentage(Double expensePercentage) {
        this.expensePercentage = expensePercentage;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Double getBalancePercentage() {
        return balancePercentage;
    }

    public void setBalancePercentage(Double balancePercentage) {
        this.balancePercentage = balancePercentage;
    }
}
