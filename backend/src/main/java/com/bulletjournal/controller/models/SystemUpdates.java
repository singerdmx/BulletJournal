package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SystemUpdates {

    private String ownedProjectsEtag;

    private String sharedProjectsEtag;

    private String groupsEtag;

    private String tasksEtag;

    private String notesEtag;

    private String notificationsEtag;

    private String remindingTaskEtag;

    private List<Task> reminders;

    public String getOwnedProjectsEtag() {
        return ownedProjectsEtag;
    }

    public void setOwnedProjectsEtag(String ownedProjectsEtag) {
        this.ownedProjectsEtag = ownedProjectsEtag;
    }

    public String getSharedProjectsEtag() {
        return sharedProjectsEtag;
    }

    public void setSharedProjectsEtag(String sharedProjectsEtag) {
        this.sharedProjectsEtag = sharedProjectsEtag;
    }

    public String getGroupsEtag() {
        return groupsEtag;
    }

    public void setGroupsEtag(String groupsEtag) {
        this.groupsEtag = groupsEtag;
    }


    public String getNotificationsEtag() {
        return notificationsEtag;
    }

    public void setNotificationsEtag(String notificationsEtag) {
        this.notificationsEtag = notificationsEtag;
    }

    public List<Task> getReminders() {
        return reminders;
    }

    public void setReminders(List<Task> reminders) {
        this.reminders = reminders;
    }

    public String getRemindingTaskEtag() {
        return remindingTaskEtag;
    }

    public void setRemindingTaskEtag(String remindingTaskEtag) {
        this.remindingTaskEtag = remindingTaskEtag;
    }

    public String getTasksEtag() {
        return tasksEtag;
    }

    public void setTasksEtag(String tasksEtag) {
        this.tasksEtag = tasksEtag;
    }

    public String getNotesEtag() {
        return notesEtag;
    }

    public void setNotesEtag(String notesEtag) {
        this.notesEtag = notesEtag;
    }

}
