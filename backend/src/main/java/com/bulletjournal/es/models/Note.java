package com.bulletjournal.es.models;

import com.bulletjournal.repository.models.Project;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Document(indexName = "note")
public class Note {

    private @Id
    Long id;

    private String name;

    private Long projectId;

    private List<com.bulletjournal.controller.models.Note> subNotes = new ArrayList<>();

    public Note() {
    }

    public Note(Long id,
                @NotNull String name,
                @NotNull Project project) {
        this.id = id;
        this.name = name;
        this.projectId = project.getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<com.bulletjournal.controller.models.Note> getSubNotes() {
        return subNotes;
    }

    public void setSubNotes(List<com.bulletjournal.controller.models.Note> subNotes) {
        this.subNotes = subNotes;
    }

}
