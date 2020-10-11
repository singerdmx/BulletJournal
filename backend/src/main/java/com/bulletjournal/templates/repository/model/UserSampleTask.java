package com.bulletjournal.templates.repository.model;


import com.bulletjournal.repository.models.User;
import javax.persistence.*;

@Entity
@Table(name = "users_sample_tasks", schema = "template")
public class UserSampleTask {
    @EmbeddedId
    private UserSampleTaskKey userSampleTaskKey;

    @ManyToOne(targetEntity = User.class)
    @MapsId("user_id")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(targetEntity = SampleTask.class)
    @MapsId("sample_task_id")
    @JoinColumn(name = "sample_task_id")
    private SampleTask sampleTask;

    public UserSampleTask() {
    }

    public UserSampleTask(User user, SampleTask sampleTask) {
        this.userSampleTaskKey = new UserSampleTaskKey(user.getId(), sampleTask.getId());
        this.user = user;
        this.sampleTask = sampleTask;
    }

    public UserSampleTaskKey getUserSampleTaskKey() {
        return userSampleTaskKey;
    }

    public void setUserSampleTaskKey(UserSampleTaskKey userSampleTaskKey) {
        this.userSampleTaskKey = userSampleTaskKey;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SampleTask getSampleTask() {
        return sampleTask;
    }

    public void setSampleTask(SampleTask sampleTask) {
        this.sampleTask = sampleTask;
    }
}
