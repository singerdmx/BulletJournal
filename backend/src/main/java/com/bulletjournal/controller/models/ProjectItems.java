package com.bulletjournal.controller.models;

import com.bulletjournal.repository.models.Transaction;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

public class ProjectItems {

    @Valid
    private List<Task> tasks = new ArrayList<>();
    @Valid
    private List<Transaction> transactions = new ArrayList<>();

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}
