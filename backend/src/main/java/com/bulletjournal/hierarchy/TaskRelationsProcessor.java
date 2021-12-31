package com.bulletjournal.hierarchy;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.controller.models.Task;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TaskRelationsProcessor {

    private static final String SUB_TASKS_KEY = "subTasks";
    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();
    private static final Gson HIERARCHY_ITEM_GSON = new Gson();

    public static List<Task> processRelations(Map<Long, com.bulletjournal.repository.models.Task> taskMap,
                                              List<HierarchyItem> relations,
                                              AuthorizationService authorizationService) {
        return processRelations(taskMap, HIERARCHY_ITEM_GSON.toJson(relations ), authorizationService);
    }

    private static List<Task> processRelations(Map<Long, com.bulletjournal.repository.models.Task> taskMap,
                                               String relations,
                                               AuthorizationService authorizationService) {
        Task[] list = GSON.fromJson(
                relations.replace(HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT, SUB_TASKS_KEY), Task[].class);
        List<Task> tasks = new ArrayList<>();
        for (Task task : list) {
            tasks.add(merge(taskMap, task, authorizationService));
        }
        return tasks;
    }

    private static Task merge(Map<Long, com.bulletjournal.repository.models.Task> taskMap,
                              Task cur, AuthorizationService authorizationService) {
        cur.clone(taskMap.get(cur.getId()).toPresentationModel(authorizationService));
        for (Task subTask : cur.getSubTasks()) {
            merge(taskMap, subTask, authorizationService);
        }
        return cur;
    }

    public static String processRelations(List<Task> tasks) {
        String jsonString = GSON.toJson(tasks);
        // replace "subTasks" with "s" to save space
        return jsonString.replace(SUB_TASKS_KEY, HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT);
    }
}