package com.bulletjournal.hierarchy;

import com.bulletjournal.templates.repository.model.Category;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CategoryRelationsProcessor {

    private static final String SUB_CATEGORIES_KEY = "subCategories";

    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

    private static final Gson HIERARCHY_ITEM_GSON = new Gson();

    public static List<com.bulletjournal.templates.controller.model.Category>
    processRelations(Map<Long, Category> categoryMap, List<HierarchyItem> relations) {
        return processRelations(categoryMap, HIERARCHY_ITEM_GSON.toJson(relations));
    }

    private static List<com.bulletjournal.templates.controller.model.Category> processRelations(
            Map<Long, Category> categoryMap, String relations) {
        com.bulletjournal.templates.controller.model.Category[] list
                = GSON.fromJson(
                relations.replace(HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT, SUB_CATEGORIES_KEY),
                com.bulletjournal.templates.controller.model.Category[].class);
        List<com.bulletjournal.templates.controller.model.Category> categories = new ArrayList<>();
        for (com.bulletjournal.templates.controller.model.Category category : list) {
            categories.add(merge(categoryMap, category));
        }
        return categories;
    }

    public static String processRelations(List<com.bulletjournal.templates.controller.model.Category> categories) {
        String jsonString = GSON.toJson(categories);
        // replace "subCategories" with "s" to save space
        return jsonString.replace(SUB_CATEGORIES_KEY, HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT);
    }

    private static com.bulletjournal.templates.controller.model.Category merge(
            Map<Long, Category> categoryMap,
            com.bulletjournal.templates.controller.model.Category cur) {
        cur.clone(categoryMap.get(cur.getId()).toPresentationModel());
        for (com.bulletjournal.templates.controller.model.Category subCategory : cur.getSubCategories()) {
            merge(categoryMap, subCategory);
        }
        return cur;
    }
}
