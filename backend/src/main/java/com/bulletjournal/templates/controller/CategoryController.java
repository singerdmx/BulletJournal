package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.hierarchy.CategoryRelationsProcessor;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.repository.CategoriesHierarchyDaoJpa;
import com.bulletjournal.templates.repository.CategoryDaoJpa;
import com.bulletjournal.templates.repository.UserCategoryDaoJpa;
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

    public static final String CATEGORY_UNSUBSCRIBE_ROUTE = "/api/categories/{categoryId}/unsubscribe";

    public static final String UPDATE_CATEGORY_SUBSCRIPTION = "/api/categories/{categoryId}/updateSubscription";

    protected static final String CATEGORY_SET_CHOICES_ROUTE = "/api/categories/{categoryId}/setChoices";

    private CategoryDaoJpa categoryDaoJpa;

    private CategoriesHierarchyDaoJpa hierarchyDaoJpa;

    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserCategoryDaoJpa userCategoryDaoJpa;

    @Autowired
    private WorkflowController workflowController;

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
        return this.categoryDaoJpa.create(params.getName(), params.getDescription(), params.getIcon(), params.getColor(), params.getForumId(), params.getImage(), params.getNextStepId(), params.getNeedStartDate()).toPresentationModel();
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
        categoryDaoJpa.updateCategory(categoryId, updateCategoryParams.getName(),
                updateCategoryParams.getIcon(), updateCategoryParams.getColor(),
                updateCategoryParams.getForumId(), updateCategoryParams.getDescription(),
                updateCategoryParams.getImage(), updateCategoryParams.getNextStepId(),
                updateCategoryParams.getNeedStartDate());
        return getCategory(categoryId);
    }

    @GetMapping(PUBLIC_CATEGORY_ROUTE)
    public Category getCategory(@NotNull @PathVariable Long categoryId) {
        List<Category> categoryList = getCategories();
        Deque<Category> deque = new ArrayDeque<>();
        categoryList.forEach(deque::offer);
        while (!deque.isEmpty()) {
            Category category = deque.poll();
            if (category.getId().equals(categoryId)) {
                Category categoryFromDb = categoryDaoJpa.getById(categoryId).toPresentationModel();
                category.setChoices(categoryFromDb.getChoices());
                category.setNextStepId(categoryFromDb.getNextStepId());
                category.setRules(categoryFromDb.getRules());
                category.setNeedStartDate(categoryFromDb.getNeedStartDate());
                return category;
            }
            category.getSubCategories().forEach(deque::offer);
        }
        throw new ResourceNotFoundException("Category id does not exist");
    }

    @PostMapping(CATEGORY_UNSUBSCRIBE_ROUTE)
    public List<SubscribedCategory> unsubscribeCategory(
            @NotNull @PathVariable Long categoryId,
            @Valid @RequestBody CategoryUnsubscribeParams categoryUnsubscribeParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.userCategoryDaoJpa.removeUserCategory(username, categoryId, categoryUnsubscribeParams);
        return this.workflowController.getUserSubscribedCategories();
    }

    @PutMapping(CATEGORY_SET_CHOICES_ROUTE)
    public Category updateChoicesForCategory(
            @NotNull @PathVariable Long categoryId,
            @NotNull @RequestBody List<Long> choicesIds) {
        validateRequester();
        categoryDaoJpa.updateChoicesForCategory(categoryId, choicesIds);
        return getCategory(categoryId);
    }

    @PostMapping(UPDATE_CATEGORY_SUBSCRIPTION)
    public List<SubscribedCategory> updateCategorySubscription(
            @NotNull @PathVariable Long categoryId,
            @Valid @RequestBody UpdateCategorySubscriptionParams updateCategorySubscriptionParams) {

        String username = MDC.get(UserClient.USER_NAME_KEY);
        userCategoryDaoJpa.updateUserCategoryProject(username, categoryId, updateCategorySubscriptionParams);
        return this.workflowController.getUserSubscribedCategories();
    }


    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
