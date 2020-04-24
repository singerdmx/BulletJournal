package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

public class ProjectItems {

    private List<Task> tasks = new ArrayList<>();

    private List<Transaction> transactions = new ArrayList<>();

    private List<Note> notes = new ArrayList<>();

    /**
     * "yyyy-MM-dd"
     */
    @NotBlank
    @Size(min = 10, max = 10)
    private String date;

    /**
     * Corresponding to date
     */
    @NotNull
    private DayOfWeek dayOfWeek;

    public static List<ProjectItems> addOwnerAvatar(
            List<ProjectItems> projectItems, final UserClient userClient) {
        projectItems.forEach(items -> {
            items.getNotes().forEach(item -> addOwnerAvatar(item, userClient));
            items.getTransactions().forEach(item -> addOwnerAvatar(item, userClient));
            items.getTasks().forEach(item -> addOwnerAvatar(item, userClient));
        });
        return projectItems;
    }

    private static void addOwnerAvatar(ProjectItem projectItem, UserClient userClient) {
        projectItem.setOwnerAvatar(userClient.getUser(projectItem.getOwner()).getAvatar());
        if (projectItem instanceof Transaction) {
            Transaction transaction = ((Transaction) projectItem);
            transaction.setPayerAvatar(userClient.getUser(transaction.getPayer()).getAvatar());
        } else if (projectItem instanceof Task) {
            Task task = ((Task) projectItem);
            task.getAssignees().forEach((assignee) -> {
                assignee.setAvatar(userClient.getUser(assignee.getName()).getAvatar());
            });
        }
    }

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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
}
