package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.Project;
import com.bulletjournal.exceptions.BadRequestException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class ProjectRelationsProcessor {

    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

    public static List<Project> processProjectRelations(
            Map<Long, com.bulletjournal.repository.models.Project> projectMap, byte[] projects) {
        String projectRelations = new String(projects);
        Project[] list = GSON.fromJson(projectRelations, Project[].class);
        return merge(projectMap, Arrays.asList(list));
    }

    private static List<Project> merge(
            Map<Long, com.bulletjournal.repository.models.Project> projects,
            List<Project> projectRelations) {
        List<Project> result = new ArrayList<>();
        for (Project p : projectRelations) {
            Project project = projects.get(p.getId()).toPresentationModel();
            result.add(project);
            for (Project subProject : merge(projects, p.getSubProjects())) {
                project.addSubProject(subProject);
            }
        }
        return result;
    }

    public static byte[] processProjectRelations(List<Project> projects) {
        String jsonString = GSON.toJson(projects);
        byte[] projectRelations;
        try {
            projectRelations = jsonString.getBytes(StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException ex) {
            throw new BadRequestException("Invalid projectRelations", ex);
        }
        return projectRelations;
    }
}
