package com.bulletjournal.controller.utils;

import com.bulletjournal.controller.models.Project;
import com.bulletjournal.exceptions.BadRequestException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;

import java.util.*;
import java.util.stream.Collectors;

public class RelationsProcessor {

    private static final String SUB_PROJECTS_KEY = "subProjects";
    private static final String SUB_PROJECTS_KEY_REPLACEMENT = "s";
    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

    public static Pair<Project, List<Project>> removeTargetProject(String projectRelations, Long projectId) {
        Triple<Project, Project, List<Project>> found = findProject(projectRelations, projectId);
        Project target = found.getLeft();
        Project targetParent = found.getMiddle();
        List<Project> projectHierarchy = found.getRight();

        if (targetParent == null) {
            // target is at root level
            projectHierarchy = projectHierarchy.stream()
                    .filter(p -> !target.getId().equals(p.getId())).collect(Collectors.toList());
        } else {
            targetParent.setSubProjects(
                    targetParent.getSubProjects().stream()
                            .filter(p -> !target.getId().equals(p.getId())).collect(Collectors.toList()));
        }
        return Pair.of(target, projectHierarchy);
    }

    public static List<Long> findSubProjects(Project parent) {
        List<Long> result = new ArrayList<>();
        findSubProjects(parent, result);
        return result;
    }

    private static void findSubProjects(Project cur, List<Long> result) {
        result.add(cur.getId());

        for (Project subProject : cur.getSubProjects()) {
            findSubProjects(subProject, result);
        }
    }

    /**
     * @return <foundProject, its parent project, whole project hierarchy>
     */
    private static Triple<Project, Project, List<Project>> findProject(String projectRelations, Long projectId) {
        Project[] parent = new Project[1];
        List<Project> list = Arrays.asList(GSON.fromJson(
                projectRelations.replace(SUB_PROJECTS_KEY_REPLACEMENT, SUB_PROJECTS_KEY), Project[].class));

        for (Project project : list) {
            Project found = findProject(project, projectId, parent);
            if (found != null) {
                return Triple.of(found, parent[0], list);
            }
        }

        throw new BadRequestException("Project " + projectId + " not found in " + projectRelations);
    }

    private static Project findProject(Project project, Long projectId, Project[] parent) {
        if (Objects.equals(projectId, project.getId())) {
            return project;
        }

        for (Project subProject : project.getSubProjects()) {
            parent[0] = project;
            Project found = findProject(subProject, projectId, parent);
            if (found != null) {
                return found;
            }
        }

        return null;
    }

    public static List<Project> processRelations(
            Map<Long, com.bulletjournal.repository.models.Project> projectMap, String projectRelations,
            Set<Long> selectedProjects) {
        Project[] list = GSON.fromJson(
                projectRelations.replace(SUB_PROJECTS_KEY_REPLACEMENT, SUB_PROJECTS_KEY), Project[].class);
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
        return jsonString.replace(SUB_PROJECTS_KEY, SUB_PROJECTS_KEY_REPLACEMENT);
    }
}
