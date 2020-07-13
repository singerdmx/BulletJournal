package com.bulletjournal.ledger;

import com.bulletjournal.controller.models.Transaction;
import com.bulletjournal.util.MathUtil;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LedgerSummary {

    private Double balance;

    private Double income;

    private Double expense;

    private List<Transaction> transactions;

    private List<TransactionsSummary> transactionsSummaries;

    private String startDate; // "yyyy-MM-dd"

    private String endDate; // "yyyy-MM-dd"

    public LedgerSummary() {
    }

    public LedgerSummary(List<Transaction> transactions, String startDate, String endDate) {
        this.transactions = transactions;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Double getBalance() {
        return MathUtil.round(balance, 2);
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Double getIncome() {
        return MathUtil.round(income, 2);
    }

    public void setIncome(Double income) {
        this.income = income;
    }

    public Double getExpense() {
        return MathUtil.round(expense, 2);
    }

    public void setExpense(Double expense) {
        this.expense = expense;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public List<TransactionsSummary> getTransactionsSummaries() {
        return transactionsSummaries;
    }

    public void setTransactionsSummaries(List<TransactionsSummary> transactionsSummaries) {
        this.transactionsSummaries = transactionsSummaries;
    }
}
