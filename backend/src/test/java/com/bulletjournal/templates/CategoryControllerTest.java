package com.bulletjournal.templates;

import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.templates.controller.CategoryController;
import com.bulletjournal.templates.controller.model.CreateCategoryParams;
import com.bulletjournal.templates.repository.CategoriesHierarchyDaoJpa;
import com.bulletjournal.templates.repository.CategoryDaoJpa;
import com.bulletjournal.templates.repository.CategoryRepository;
import com.bulletjournal.templates.repository.model.CategoriesHierarchy;
import com.bulletjournal.templates.repository.model.Category;
import com.google.gson.Gson;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Tests {@link com.bulletjournal.templates.repository.CategoriesHierarchyDaoJpa}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class CategoryControllerTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryControllerTest.class);

    private static final String[] CATEGORY_NAMES = new String[]{"c0", "c1", "c2", "c3", "c4", "c5"};
    private static final String CATEGORY_DESCRIPTION = "fakeDescription";
    private static final String ROOT_URL = "http://localhost:";
    private static final String[] ICONS = new String[]{"SearchOutlined", "FireOutlined", "DingtalkOutlined"};
    private static final String[] COLORS = new String[]{"#ffb3cc", "#b3b3ff", "#b3f0ff"};

    private static final Gson GSON = new Gson();

    private static final String USER = "BulletJournal"; // with admin role

    @Autowired
    CategoriesHierarchyDaoJpa hierarchyDaoJpa;

    @Autowired
    CategoryDaoJpa categoryDaoJpa;

    @Autowired
    CategoryRepository categoryRepository;

    @LocalServerPort
    int randomServerPort;

    private TestRestTemplate restTemplate = new TestRestTemplate();

    private final List<Category> categories = new ArrayList<>();

    private final Long[] categoriesIds = new Long[6];

    private List<HierarchyItem> hierarchyItemList1;

    private List<com.bulletjournal.templates.controller.model.Category> categoryList1;

    @Before
    public void setup() {
        hierarchyDaoJpa.updateHierarchy("[]");
        categoryRepository.deleteAll();
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @After
    public void tearDown() {
        hierarchyDaoJpa.updateHierarchy("[]");
        categoryRepository.deleteAll();
    }

    @Test
    public void testCategoryHierarchy() throws Exception {
        addCategories();
        createHierarchy1();
        createCategoriesWithHierarchy1();

        updateHierarchy(categoryList1);
        CategoriesHierarchy categoriesHierarchy = hierarchyDaoJpa.getHierarchies();
        Assert.assertEquals(GSON.toJson(hierarchyItemList1), categoriesHierarchy.getHierarchy());

        List<com.bulletjournal.templates.controller.model.Category> responseCategoryList
            = getCategories();
        if (!checkRelations(responseCategoryList, hierarchyItemList1)) {
            LOGGER.error("category relations mismatch, expected: {}, actual: {}", hierarchyItemList1, categoryList1);
            Assert.fail();
        }

        /** Original:
         *    0
         *    |----1
         *    |    |----2
         *    |    |----3
         *    |
         *    |----4
         *
         *    5
         *
         *  After remove 1, should become
         *    0
         *    |----4
         *
         *    5
         *    2
         *    3
         */
        // build expected hierarchy list
        HierarchyItem item5 = new HierarchyItem(categoriesIds[5]);
        HierarchyItem item4 = new HierarchyItem(categoriesIds[4]);
        HierarchyItem item3 = new HierarchyItem(categoriesIds[3]);
        HierarchyItem item2 = new HierarchyItem(categoriesIds[2]);
        HierarchyItem item0 = new HierarchyItem(categoriesIds[0]);
        item0.getS().add(item4);
        LinkedList<HierarchyItem> expectedHierarchyItems = new LinkedList<>();
        expectedHierarchyItems.add(item2);
        expectedHierarchyItems.add(item3);
        expectedHierarchyItems.sort(Comparator.comparingLong(HierarchyItem::getId));
        expectedHierarchyItems.addFirst(item0);
        expectedHierarchyItems.addFirst(item5);
        responseCategoryList = deleteCategory(categoriesIds[1]);
        checkRelations(responseCategoryList, expectedHierarchyItems);

        // create new categories, should not affect hierarchy, and new created category
        // should appear at the end of list
        String name1 = "newC1", name2 = "newC2";
        com.bulletjournal.templates.controller.model.Category category1 = createCategory(name1);
        Assert.assertEquals(name1, category1.getName());
        com.bulletjournal.templates.controller.model.Category category2 = createCategory(name2);
        Assert.assertEquals(name2, category2.getName());

        HierarchyItem newItem1 = new HierarchyItem(category1.getId());
        HierarchyItem newItem2 = new HierarchyItem(category2.getId());
        expectedHierarchyItems.addAll(
            Stream.of(newItem1, newItem2)
                .sorted(Comparator.comparingLong(HierarchyItem::getId)).collect(Collectors.toList())
        );
        List<com.bulletjournal.templates.controller.model.Category> newCategoryList = getCategories();
        checkRelations(newCategoryList, expectedHierarchyItems);
    }

    private boolean checkRelations(
        List<com.bulletjournal.templates.controller.model.Category> categoryList,
        List<HierarchyItem> hierarchyItemList
    ) {
        if (categoryList.size() != hierarchyItemList.size()) {
            return false;
        }
        for (int i = 0; i < categoryList.size(); ++i) {
            if (!checkRelation(categoryList.get(i), hierarchyItemList.get(i))) {
                return false;
            }
        }
        return true;
    }

    private boolean checkRelation(
        com.bulletjournal.templates.controller.model.Category category,
        HierarchyItem hierarchyItem
    ) {
        if (!Objects.equals(category.getId(), hierarchyItem.getId())) {
            return false;
        }
        if (category.getSubCategories().size() != hierarchyItem.getS().size()) {
            return false;
        }
        for (int i = 0; i < category.getSubCategories().size(); ++i) {
            if (!checkRelation(category.getSubCategories().get(i), hierarchyItem.getS().get(i))) {
                return false;
            }
        }
        return true;
    }

    private com.bulletjournal.templates.controller.model.Category createCategory(String name) {
        ResponseEntity<com.bulletjournal.templates.controller.model.Category> response
            = this.restTemplate.exchange(
            ROOT_URL + randomServerPort + CategoryController.CATEGORIES_ROUTE,
            HttpMethod.POST,
            TestHelpers.actAsOtherUser(new CreateCategoryParams(name, CATEGORY_DESCRIPTION, false), USER),
            com.bulletjournal.templates.controller.model.Category.class);
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        return response.getBody();
    }

    private List<com.bulletjournal.templates.controller.model.Category> getCategories() {
        ResponseEntity<com.bulletjournal.templates.controller.model.Category[]> response
            = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + CategoryController.PUBLIC_CATEGORIES_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                com.bulletjournal.templates.controller.model.Category[].class);
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        return Arrays.asList(response.getBody());
    }

    private List<com.bulletjournal.templates.controller.model.Category> deleteCategory(Long id) {
        ResponseEntity<com.bulletjournal.templates.controller.model.Category[]> response
            = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + CategoryController.CATEGORY_ROUTE,
            HttpMethod.DELETE,
            TestHelpers.actAsOtherUser(null, USER),
            com.bulletjournal.templates.controller.model.Category[].class,
            categoriesIds[0]);
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        return Arrays.asList(response.getBody());
    }

    private void updateHierarchy(List<com.bulletjournal.templates.controller.model.Category> categoryList) {
        ResponseEntity<com.bulletjournal.templates.controller.model.Category[]> response
            = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + CategoryController.CATEGORIES_ROUTE,
                HttpMethod.PUT,
                TestHelpers.actAsOtherUser(categoryList, USER),
                com.bulletjournal.templates.controller.model.Category[].class);
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    /**
     *    0
     *    |----1
     *    |    |----2
     *    |    |----3
     *    |
     *    |----4
     *
     *    5
     */
    private void createHierarchy1() {
        HierarchyItem item5 = new HierarchyItem(categoriesIds[5]);
        HierarchyItem item4 = new HierarchyItem(categoriesIds[4]);
        HierarchyItem item3 = new HierarchyItem(categoriesIds[3]);
        HierarchyItem item2 = new HierarchyItem(categoriesIds[2]);
        HierarchyItem item1 = new HierarchyItem(categoriesIds[1]);
        HierarchyItem item0 = new HierarchyItem(categoriesIds[0]);
        item0.getS().add(item4);
        item1.getS().add(item2);
        item1.getS().add(item3);
        item0.getS().add(item1);
        List<HierarchyItem> hierarchyItems = new ArrayList<>();
        hierarchyItems.add(item0);
        hierarchyItems.add(item5);
        this.hierarchyItemList1 = hierarchyItems;
    }

    private void createCategoriesWithHierarchy1() {
        com.bulletjournal.templates.controller.model.Category item5
            = new com.bulletjournal.templates.controller.model.Category(categoriesIds[5], CATEGORY_NAMES[5], CATEGORY_DESCRIPTION, new ArrayList<>());
        com.bulletjournal.templates.controller.model.Category item4
            = new com.bulletjournal.templates.controller.model.Category(categoriesIds[4], CATEGORY_NAMES[4], CATEGORY_DESCRIPTION, new ArrayList<>());
        com.bulletjournal.templates.controller.model.Category item3
            = new com.bulletjournal.templates.controller.model.Category(categoriesIds[3], CATEGORY_NAMES[3], CATEGORY_DESCRIPTION, new ArrayList<>());
        com.bulletjournal.templates.controller.model.Category item2
            = new com.bulletjournal.templates.controller.model.Category(categoriesIds[2], CATEGORY_NAMES[2], CATEGORY_DESCRIPTION, new ArrayList<>());
        com.bulletjournal.templates.controller.model.Category item1
            = new com.bulletjournal.templates.controller.model.Category(categoriesIds[1], CATEGORY_NAMES[1], CATEGORY_DESCRIPTION, new ArrayList<>());
        com.bulletjournal.templates.controller.model.Category item0
            = new com.bulletjournal.templates.controller.model.Category(categoriesIds[0], CATEGORY_NAMES[0], CATEGORY_DESCRIPTION, new ArrayList<>());
        item0.getSubCategories().add(item4);
        item1.getSubCategories().add(item2);
        item1.getSubCategories().add(item3);
        item0.getSubCategories().add(item1);
        List<com.bulletjournal.templates.controller.model.Category> list = new ArrayList<>();
        list.add(item0);
        list.add(item5);
        this.categoryList1 = list;
    }

    private void addCategories() {
        int i = 0;
        for (String name : CATEGORY_NAMES) {
            Category category =  categoryDaoJpa.create(name, CATEGORY_DESCRIPTION, ICONS[0], COLORS[0], null, null, null, false);
            categories.add(category);
            categoriesIds[i] = category.getId();
            i++;
        }
    }
}
