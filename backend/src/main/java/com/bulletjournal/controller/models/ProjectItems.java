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

    public static List<ProjectItems> addAvatar(
            List<ProjectItems> projectItems, final UserClient userClient) {
        projectItems.forEach(items -> {
            ProjectItem.addAvatar(items.getNotes(), userClient);
            ProjectItem.addAvatar(items.getTasks(), userClient);
            ProjectItem.addAvatar(items.getTransactions(), userClient);
        });
        return projectItems;
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
