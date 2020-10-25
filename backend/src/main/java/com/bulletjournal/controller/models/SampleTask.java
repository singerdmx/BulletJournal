package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Project;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

public class SampleTask extends Task {

    public SampleTask() {
    }

    public SampleTask(Long id, @NotNull User owner, List<User> assignees, String dueDate, String dueTime,
                      @NotBlank String timezone, @NotNull String name, Integer duration, @NotNull Project project,
                      List<Label> labels, ReminderSetting reminderSetting, String recurrenceRule,
                      Long createdAt, Long updatedAt, TaskStatus status, Long reminderDateTime) {
        super(id, owner, assignees, dueDate, dueTime, timezone, name, duration, project,
                labels, reminderSetting, recurrenceRule, createdAt, updatedAt, status, reminderDateTime);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.SAMPLE_TASK;
    }

}
