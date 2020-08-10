package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.Category;
import com.bulletjournal.templates.repository.CategoriesHierarchyDaoJpa;
import com.bulletjournal.templates.repository.CategoryDaoJpa;
import com.bulletjournal.templates.repository.model.CategoriesHierarchy;
import com.google.gson.Gson;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class CategoryController {

    public static final String CATEGORIES_ROUTE = "/api/categories";

    public static final String CATEGORIES_HIERARCHY_ROUTE = "/api/categories/hierarchy";

    private static Gson GSON = new Gson();

    private CategoryDaoJpa categoryDaoJpa;

    private CategoriesHierarchyDaoJpa hierarchyDaoJpa;

    private UserDaoJpa userDaoJpa;

    @Autowired
    public CategoryController(
        CategoryDaoJpa categoryDaoJpa,
        CategoriesHierarchyDaoJpa hierarchyDaoJpa,
        UserDaoJpa userDaoJpa
    ) {
        this.categoryDaoJpa = categoryDaoJpa;
        this.hierarchyDaoJpa = hierarchyDaoJpa;
        this.userDaoJpa = userDaoJpa;
    }

    @GetMapping(CATEGORIES_ROUTE)
    public List<Category> getCategories() {
        validateRequester();

        List<com.bulletjournal.templates.repository.model.Category> allCategories
            = categoryDaoJpa.getAllCategories();
        CategoriesHierarchy categoriesHierarchy = hierarchyDaoJpa.getHierarchies();
        Set<Long> existingIds = allCategories.stream()
            .map(com.bulletjournal.templates.repository.model.Category::getId)
            .collect(Collectors.toSet());
        Pair<List<HierarchyItem>, Set<Long>> hierarchy =
            HierarchyProcessor.findAllIds(categoriesHierarchy.getHierarchy(), existingIds);
        List<HierarchyItem> keptHierarchy = hierarchy.getLeft();
        Set<Long> processedIds = hierarchy.getRight();

        Map<Long, com.bulletjournal.templates.repository.model.Category> categoryIdMap
            = allCategories.stream().collect(
                Collectors.toMap(com.bulletjournal.templates.repository.model.Category::getId, category -> category));
        List<Category> ret = copyCategoriesToRepresentanalModelWithHierarchy(categoryIdMap, keptHierarchy);
        allCategories.stream().filter(category -> !processedIds.contains(category.getId()))
            .forEach(category -> ret.add(category.toPresentationalModel()));
        return ret;
    }

    @PostMapping(CATEGORIES_HIERARCHY_ROUTE)
    public void updateHierarchy(@NotNull @Valid @RequestBody List<Category> categoryList) {
        validateRequester();
        List<HierarchyItem> hierarchyItems
            = categoryList.stream().map(this::categoryToHierarchyItem).collect(Collectors.toList());
        hierarchyDaoJpa.updateHierarchy(GSON.toJson(hierarchyItems));
    }

    private HierarchyItem categoryToHierarchyItem(Category category) {
        HierarchyItem ret = new HierarchyItem(category.getId());
        for (Category childCategory : category.getSubCategories()) {
            HierarchyItem childItem = categoryToHierarchyItem(childCategory);
            ret.getS().add(childItem);
        }
        return ret;
    }

    private List<Category> copyCategoriesToRepresentanalModelWithHierarchy(
        Map<Long, com.bulletjournal.templates.repository.model.Category> allCategoryIdMap,
        List<HierarchyItem> keptHierarchy
    ) {
        List<Category> ret = new ArrayList<>();
        for (HierarchyItem hierarchyItem : keptHierarchy) {
            ret.add(copyCategory(allCategoryIdMap, hierarchyItem));
        }
        return ret;
    }

    private Category copyCategory(
        Map<Long, com.bulletjournal.templates.repository.model.Category> allCategories,
        HierarchyItem hierarchyItem
    ) {
        Category ret = allCategories.get(hierarchyItem.getId()).toPresentationalModel();
        for (HierarchyItem childItem : hierarchyItem.getS()) {
            Category childCategory = copyCategory(allCategories, childItem);
            ret.getSubCategories().add(childCategory);
        }
        return ret;
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
