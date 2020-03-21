package com.bulletjournal.hierarchy;

import com.bulletjournal.exceptions.BadRequestException;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class HierarchyProcessor {

    private static final Gson GSON = new Gson();

    public static List<HierarchyItem> removeTargetItem(String relations, Long targetId) {
        HierarchyItem[] target = new HierarchyItem[1];
        return removeTargetItem(relations, targetId, target);
    }

    /**
     * Delete target item and all its descendants
     *
     * @return hierarchyItems
     */
    public static List<HierarchyItem> removeTargetItem(String relations, Long targetId, HierarchyItem[] target) {
        List<HierarchyItem> hierarchyItems = getItemsFromJson(relations);
        HierarchyItem[] parent = new HierarchyItem[1];
        target[0] = findTarget(hierarchyItems, targetId, parent);

        HierarchyItem targetParent = parent[0];
        if (targetParent == null) {
            // target is at root level
            hierarchyItems = hierarchyItems.stream()
                    .filter(p -> !targetId.equals(p.getId())).collect(Collectors.toList());
        } else {
            targetParent.setS(
                    targetParent.getS().stream()
                            .filter(p -> !targetId.equals(p.getId())).collect(Collectors.toList()));
        }

        return hierarchyItems;
    }

    private static HierarchyItem findTarget(
            List<HierarchyItem> hierarchyItems, Long targetId, HierarchyItem[] targetParent) {
        HierarchyItem target = null;
        for (HierarchyItem item : hierarchyItems) {
            target = findItem(item, targetId, null, targetParent);
            if (target != null) {
                break;
            }
        }

        if (target == null) {
            throw new BadRequestException("Target " + targetId + " not found ");
        }
        return target;
    }

    private static HierarchyItem findItem(HierarchyItem cur, Long targetId,
                                          HierarchyItem parent, HierarchyItem[] targetParent) {
        if (Objects.equals(targetId, cur.getId())) {
            targetParent[0] = parent;
            return cur;
        }

        for (HierarchyItem item : cur.getS()) {
            HierarchyItem found = findItem(item, targetId, cur, targetParent);
            if (found != null) {
                return found;
            }
        }

        return null;
    }

    /**
     * @return ids of target parent and all its descendants
     */
    public static List<Long> getSubItems(String relations, Long targetId) {
        List<HierarchyItem> hierarchyItems = getItemsFromJson(relations);
        List<Long> result = new ArrayList<>();
        findSubItems(findTarget(hierarchyItems, targetId, new HierarchyItem[1]), result);
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

    public static String addItem(String jsonString, Long id) {
        return addItem(jsonString, new HierarchyItem(id));
    }

    public static String addItem(String jsonString, HierarchyItem hierarchyItem) {
        if (StringUtils.isBlank(jsonString)) {
            jsonString = "[]";
        }

        List<HierarchyItem> list = new ArrayList<>(getItemsFromJson(jsonString));
        list.add(hierarchyItem);
        return GSON.toJson(list);
    }
}
