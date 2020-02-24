package com.bulletjournal.hierarchy;

import com.bulletjournal.controller.models.Task;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;

public class TaskRelationsProcessor {

    private static final String SUB_TASKS_KEY = "subTasks";
    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

    public static String processRelations(List<Task> tasks) {
        String jsonString = GSON.toJson(tasks);
        // replace "subTasks" with "s" to save space
        return jsonString.replace(SUB_TASKS_KEY, HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT);
    }
}