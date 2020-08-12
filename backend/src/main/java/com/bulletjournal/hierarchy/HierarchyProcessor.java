package com.bulletjournal.hierarchy;

import com.google.gson.Gson;
import org.apache.commons.lang3.tuple.Pair;

import java.util.*;

public class HierarchyProcessor {

    public static final Gson GSON = new Gson();

    public static Pair<List<HierarchyItem>, Set<Long>> findAllIds(String relations, Set<Long> existingIds) {
        List<HierarchyItem> hierarchyItems = getItemsFromJson(relations);
        Set<Long> processedIds = new HashSet<>();
        List<HierarchyItem> ret = new ArrayList<>();

        for (int i = 0; i < hierarchyItems.size(); i++) {
            HierarchyItem hierarchyItem = findAllIds(hierarchyItems.get(i), existingIds, processedIds);
            if (hierarchyItem != null) {
                ret.add(hierarchyItem);
            }
        }

        return Pair.of(ret, processedIds);
    }

    private static HierarchyItem findAllIds(HierarchyItem hierarchyItem, Set<Long> existingIds, Set<Long> processedIds) {
        if (hierarchyItem == null || (existingIds != null && !existingIds.contains(hierarchyItem.getId()))) {
            return null;
        }
        processedIds.add(hierarchyItem.getId());
        List<HierarchyItem> children = new ArrayList<>();
        for (HierarchyItem child : hierarchyItem.getS()) {
            if (existingIds == null || existingIds.contains(child.getId())) {
                findAllIds(child, existingIds, processedIds);
                children.add(child);
            }

        }
        hierarchyItem.setS(children);
        return hierarchyItem;
    }

    private static List<HierarchyItem> getItemsFromJson(String jsonString) {
        return Arrays.asList(GSON.fromJson(
                jsonString, HierarchyItem[].class));
    }
}
