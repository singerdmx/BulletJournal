package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.hierarchy.CategoryRelationsProcessor;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.Category;
import com.bulletjournal.templates.controller.model.CreateCategoryParams;
import com.bulletjournal.templates.controller.model.UpdateCategoryParams;
import com.bulletjournal.templates.repository.CategoriesHierarchyDaoJpa;
import com.bulletjournal.templates.repository.CategoryDaoJpa;
import com.bulletjournal.templates.repository.model.CategoriesHierarchy;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class CategoryController {

    public static final String CATEGORIES_ROUTE = "/api/categories";

    public static final String CATEGORY_ROUTE = "/api/categories/{categoryId}";

    public static final String PUBLIC_CATEGORIES_ROUTE = "/api/public/categories";

    public static final String PUBLIC_CATEGORY_ROUTE = "/api/public/categories/{categoryId}";

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

    @GetMapping(PUBLIC_CATEGORIES_ROUTE)
    public List<Category> getCategories() {
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

        List<Category> ret = new ArrayList<>(CategoryRelationsProcessor.processRelations(categoryIdMap, keptHierarchy));
        ret.addAll(allCategories.stream()
            .filter(category -> !processedIds.contains(category.getId()))
            .map(com.bulletjournal.templates.repository.model.Category::toPresentationModel)
            .sorted(Comparator.comparingLong(Category::getId)).collect(Collectors.toList()));
        return ret;
    }

    @PostMapping(CATEGORIES_ROUTE)
    public Category createCategory(@Valid @RequestBody CreateCategoryParams params) {
        validateRequester();
        return this.categoryDaoJpa.create(params.getName(), params.getDescription(), params.getIcon(), params.getColor(), params.getForumId(), params.getImage()).toPresentationModel();
    }

    @PutMapping(CATEGORIES_ROUTE)
    public List<Category> updateRelations(@NotNull @Valid @RequestBody List<Category> categoryList) {
        validateRequester();
        String newHierarchy = CategoryRelationsProcessor.processRelations(categoryList);
        hierarchyDaoJpa.updateHierarchy(newHierarchy);
        return getCategories();
    }

    @DeleteMapping(CATEGORY_ROUTE)
    public List<Category> deleteCategory(@NotNull @PathVariable Long categoryId) {
        validateRequester();
        categoryDaoJpa.deleteById(categoryId);
        return getCategories();
    }

    @PutMapping(CATEGORY_ROUTE)
    public Category updateCategory(@NotNull @PathVariable Long categoryId,
                               @Valid @RequestBody UpdateCategoryParams updateCategoryParams) {
        validateRequester();
        com.bulletjournal.templates.repository.model.Category category = categoryDaoJpa.getById(categoryId);
        category.setName(updateCategoryParams.getName());
        category.setIcon(updateCategoryParams.getIcon());
        category.setColor(updateCategoryParams.getColor());
        category.setForumId(updateCategoryParams.getForumId());
        category.setDescription(updateCategoryParams.getDescription());
        categoryDaoJpa.save(category);
        return getCategory(categoryId);
    }

    @GetMapping(PUBLIC_CATEGORY_ROUTE)
    public Category getCategory(@NotNull @PathVariable Long categoryId) {
        return categoryDaoJpa.getById(categoryId).toPresentationModel();
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
