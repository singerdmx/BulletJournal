package com.bulletjournal.hierarchy;

import com.bulletjournal.controller.models.Project;
import com.bulletjournal.controller.models.ProjectType;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ProjectRelationsProcessor {

    private static final String SUB_PROJECTS_KEY = "subProjects";
    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

    public static List<Project> processRelations(
            Map<Long, com.bulletjournal.repository.models.Project> projectMap,
            List<HierarchyItem> projectRelations,
            Set<Long> selectedProjects) {
        return processRelations(projectMap, HierarchyProcessor.GSON.toJson(projectRelations), selectedProjects);
    }

    public static List<Project> processRelations(
            Map<Long, com.bulletjournal.repository.models.Project> projectMap, String projectRelations,
            Set<Long> selectedProjects) {
        Project[] list = GSON.fromJson(
                projectRelations.replace(HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT, SUB_PROJECTS_KEY), Project[].class);
        List<Project> projects = new ArrayList<>();
        for (Project project : list) {
            if (merge(projectMap, project, selectedProjects) > 0) {
                projects.add(project);
            }
        }

        return projects;
    }

    private static int merge(
            Map<Long, com.bulletjournal.repository.models.Project> m,
            Project project,
            Set<Long> selectedProjects) {
        int count = 0;

        List<Project> subProjects = project.getSubProjects();
        if (selectedProjects == null || selectedProjects.contains(project.getId())) {
            project.clone(m.get(project.getId()).toPresentationModel());
            count++;
        } else {
            // unselected project only shows name and type, without owner
            project.setName(m.get(project.getId()).getName());
            project.setProjectType(ProjectType.getType(m.get(project.getId()).getType()));
        }
        project.setSubProjects(new ArrayList<>());

        for (Project subProject : subProjects) {
            int subCount = merge(m, subProject, selectedProjects);
            count += subCount;
            if (subCount > 0) {
                project.addSubProject(subProject);
            }
        }

        return count;
    }

    public static String processRelations(List<Project> projects) {
        String jsonString = GSON.toJson(projects);
        // replace "subProjects" with "s" to save space
        return jsonString.replace(SUB_PROJECTS_KEY, HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT);
    }
}
