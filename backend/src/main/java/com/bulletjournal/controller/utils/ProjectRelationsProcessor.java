package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.Project;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class ProjectRelationsProcessor {

    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

    public static List<Project> processProjectRelations(
            Map<Long, com.bulletjournal.repository.models.Project> projectMap, String projectRelations) {
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

    public static String processProjectRelations(List<Project> projects) {
        String jsonString = GSON.toJson(projects);
        return jsonString;
    }
}
