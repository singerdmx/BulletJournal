package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "project_settings")
public class ProjectSetting {
    @Id
    @Column(name = "project_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "project_id")
    private Project project;

    @Column
    private String color;

    @Column(name = "auto_delete")
    private boolean autoDelete;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isAutoDelete() {
        return autoDelete;
    }

    public void setAutoDelete(boolean autoDelete) {
        this.autoDelete = autoDelete;
    }
}
