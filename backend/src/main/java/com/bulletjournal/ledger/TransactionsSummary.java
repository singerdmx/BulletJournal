package com.bulletjournal.ledger;

import com.bulletjournal.util.MathUtil;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionsSummary {

    private String name;

    private String metadata;

    private Double income;

    private Double incomePercentage;

    private Double expense;

    private Double expensePercentage;

    private Double balance;

    private Double balancePercentage;

    private Integer incomeCount;

    private Integer expenseCount;

    public TransactionsSummary() {
    }

    public TransactionsSummary(String name, String metadata, Double income, Double incomePercentage,
                               Double expense, Double expensePercentage, Double balance, Double balancePercentage,
                               Integer incomeCount, Integer expenseCount) {
        this.name = name;
        this.metadata = metadata;
        this.income = income;
        this.incomePercentage = incomePercentage;
        this.expense = expense;
        this.expensePercentage = expensePercentage;
        this.balance = balance;
        this.balancePercentage = balancePercentage;
        this.incomeCount = incomeCount;
        this.expenseCount = expenseCount;
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
        return MathUtil.round(income, 2);
    }

    public void setIncome(Double income) {
        this.income = income;
    }

    public Double getIncomePercentage() {
        return MathUtil.round(incomePercentage, 0);
    }

    public void setIncomePercentage(Double incomePercentage) {
        this.incomePercentage = incomePercentage;
    }

    public Double getExpense() {
        return MathUtil.round(expense, 2);
    }

    public void setExpense(Double expense) {
        this.expense = expense;
    }

    public Double getExpensePercentage() {
        return MathUtil.round(expensePercentage, 0);
    }

    public void setExpensePercentage(Double expensePercentage) {
        this.expensePercentage = expensePercentage;
    }

    public Double getBalance() {
        return MathUtil.round(balance, 2);
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Double getBalancePercentage() {
        return MathUtil.round(balancePercentage, 0);
    }

    public void setBalancePercentage(Double balancePercentage) {
        this.balancePercentage = balancePercentage;
    }

    public Integer getIncomeCount() {
        return incomeCount;
    }

    public void setIncomeCount(Integer incomeCount) {
        this.incomeCount = incomeCount;
    }

    public Integer getExpenseCount() {
        return expenseCount;
    }

    public void setExpenseCount(Integer expenseCount) {
        this.expenseCount = expenseCount;
    }
}
