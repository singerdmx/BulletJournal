package com.bulletjournal.templates;

import com.bulletjournal.controller.models.RequestParams;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.templates.controller.CategoryController;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Tests {@link com.bulletjournal.templates.repository.CategoriesHierarchyDaoJpa}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class CategoryControllerTest {

    private static final String[] CATEGORY_NAMES = new String[]{"c0", "c1", "c2", "c3", "c4", "c5"};
    private static final String CATEGORY_DESCRIPTION = "fakeDescription";
    private static final String ROOT_URL = "http://localhost:";

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

    private RequestParams requestParams;

    private final List<Category> categories = new ArrayList<>();

    private final Long[] categoriesIds = new Long[6];

    private List<HierarchyItem> hierarchyItemList1;

    private List<com.bulletjournal.templates.controller.model.Category> categoryList1;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        requestParams = new RequestParams(restTemplate, randomServerPort);
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
        System.out.println(responseCategoryList);
    }

    private List<com.bulletjournal.templates.controller.model.Category> getCategories() {
        ResponseEntity<com.bulletjournal.templates.controller.model.Category[]> response
            = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + CategoryController.CATEGORIES_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                com.bulletjournal.templates.controller.model.Category[].class);
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        return Arrays.asList(response.getBody());
    }

    private void updateHierarchy(List<com.bulletjournal.templates.controller.model.Category> categoryList) {
        ResponseEntity<?> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + CategoryController.CATEGORIES_HIERARCHY_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(categoryList, USER),
                void.class);
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
            Category category =  categoryDaoJpa.create(name, CATEGORY_DESCRIPTION);
            categories.add(category);
            categoriesIds[i] = category.getId();
            i++;
        }
    }
}
