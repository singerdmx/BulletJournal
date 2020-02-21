package com.bulletjournal.hierarchy;

import com.google.gson.Gson;

import java.util.Arrays;
import java.util.List;

public class HierarchyProcessor {

    private static final Gson GSON = new Gson();

    List<HierarchyItem> getItemsFromJson(String jsonString) {
        return Arrays.asList(GSON.fromJson(
                jsonString, HierarchyItem[].class));
    }
}
