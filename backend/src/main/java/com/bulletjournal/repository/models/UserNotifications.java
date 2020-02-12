package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "user_notifications")
public class UserNotifications extends AuditModel {

    @Id
    private String name;

    @Lob
    @Column
    private String notifications;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


}
