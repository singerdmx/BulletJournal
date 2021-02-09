package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Myself extends User {

    private String timezone;

    private Integer reminderBeforeTask;

    private String currency;

    private String theme;

    private Integer points;

    private boolean firstTime = false;

    private boolean sendUserInvitation = false;

    private List<BankAccount> bankAccounts = new ArrayList<>();

    public Myself() {
    }

    public Myself(User user, String timezone, Before reminderBeforeTask, String currency, String theme,
                  Integer points) {
        this(user, timezone, reminderBeforeTask, currency, theme, points, false, false, new ArrayList<>());
    }

    public Myself(User user, String timezone, Before reminderBeforeTask, String currency, String theme,
                  Integer points, boolean firstTime, boolean sendUserInvitation, List<BankAccount> bankAccounts) {
        super(user.getId(), user.getName(), user.getThumbnail(), user.getAvatar());
        this.timezone = timezone;
        if (reminderBeforeTask != null) {
            this.reminderBeforeTask = reminderBeforeTask.getValue();
        }
        this.currency = currency;
        this.theme = theme;
        this.points = points;
        this.firstTime = firstTime;
        this.sendUserInvitation = sendUserInvitation;
        this.bankAccounts = bankAccounts;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean hasTimezone() {
        return this.timezone != null;
    }

    public Integer getReminderBeforeTask() {
        return reminderBeforeTask;
    }

    public void setReminderBeforeTask(Integer reminderBeforeTask) {
        this.reminderBeforeTask = reminderBeforeTask;
    }

    public boolean hasBefore() {
        return this.reminderBeforeTask != null;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public boolean isFirstTime() {
        return firstTime;
    }

    public void setFirstTime(boolean firstTime) {
        this.firstTime = firstTime;
    }

    public boolean isSendUserInvitation() {
        return sendUserInvitation;
    }

    public void setSendUserInvitation(boolean sendUserInvitation) {
        this.sendUserInvitation = sendUserInvitation;
    }

    public List<BankAccount> getBankAccounts() {
        return bankAccounts;
    }

    public void setBankAccounts(List<BankAccount> bankAccounts) {
        this.bankAccounts = bankAccounts;
    }
}
