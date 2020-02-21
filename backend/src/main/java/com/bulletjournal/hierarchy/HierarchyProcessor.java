package com.bulletjournal.hierarchy;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class HierarchyProcessor {

    private static final Gson GSON = new Gson();

    /**
     * @return ids of target parent and all its descendants
     */
    public static List<Long> getSubItems(HierarchyItem parent) {
        List<Long> result = new ArrayList<>();
        findSubItems(parent, result);
        return result;
    }

    private static void findSubItems(HierarchyItem cur, List<Long> result) {
        result.add(cur.getId());

        for (HierarchyItem subItem : cur.getS()) {
            findSubItems(subItem, result);
        }
    }

    private static List<HierarchyItem> getItemsFromJson(String jsonString) {
        return Arrays.asList(GSON.fromJson(
                jsonString, HierarchyItem[].class));
    }
}
