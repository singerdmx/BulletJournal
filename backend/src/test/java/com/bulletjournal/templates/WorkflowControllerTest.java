package com.bulletjournal.templates;

import com.bulletjournal.controller.TaskController;
import com.bulletjournal.controller.models.Content;
import com.bulletjournal.controller.models.Task;
import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.templates.controller.CategoryController;
import com.bulletjournal.templates.controller.RuleController;
import com.bulletjournal.templates.controller.StepController;
import com.bulletjournal.templates.controller.WorkflowController;
import com.bulletjournal.templates.controller.model.*;
import com.google.common.collect.ImmutableList;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.Order;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class WorkflowControllerTest {
    private static final String USER = "BulletJournal"; // with admin role
    private static final String ROOT_URL = "http://localhost:";

    private final TestRestTemplate restTemplate = new TestRestTemplate();
    @LocalServerPort
    int randomServerPort;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    /**
     * Tests {@link WorkflowController#importSampleTasks(ImportTasksParams)}
     */
    @Test
    @Order(1)
    public void testWorkflowImportTasks() throws Exception {
        ImportTasksParams importTasksParams = new ImportTasksParams();
        importTasksParams.setSampleTasks(ImmutableList.of(1479L, 1412L, 1384L, 1369L, 1159L, 1336L, 1225L, 1194L, 1127L, 1097L, 618L, 615L, 601L, 579L, 571L, 569L, 262L, 185L, 618L, 615L, 601L, 579L, 571L, 569L, 262L, 185L));
        importTasksParams.setCategoryId(13L);
        importTasksParams.setSelections(ImmutableList.of(56L, 15L, 248L));
        importTasksParams.setScrollId("");
        importTasksParams.setProjectId(16L);
        importTasksParams.setSubscribed(true);
        importTasksParams.setAssignees(ImmutableList.of("BulletJournal"));
        importTasksParams.setLabels(ImmutableList.of());
        importTasksParams.setTimezone("America/Los_Angeles");
        importTasksParams.setStartDate("2020-10-01");
        importTasksParams.setReminderBefore(1);
        checkImportTasksParamsWorkflow(importTasksParams);
    }

    /**
     * Tests {@link WorkflowController#getUserSubscribedCategories()}
     * Tests {@link CategoryController#unsubscribeCategory(Long, CategoryUnsubscribeParams)}
     */
    @Test
    public void testUserSubscribedCategories() throws Exception {
        List<SubscribedCategory> subscribedCategories = getUserSubscribedCategories();
        assertEquals(2, subscribedCategories.size());
        SubscribedCategory subscribedCategory = subscribedCategories.get(0);
        assertEquals(15L, subscribedCategory.getCategory().getId().intValue());
        assertEquals(1, subscribedCategory.getSelections().size());
        assertEquals(257L, subscribedCategory.getSelections().get(0).getId().intValue());
        assertEquals(1, subscribedCategory.getProjects().size());
        assertEquals(11L, subscribedCategory.getProjects().get(0).getId().intValue());
        subscribedCategory = subscribedCategories.get(1);
        assertEquals(13L, subscribedCategory.getCategory().getId().intValue());
        assertEquals(2, subscribedCategory.getSelections().size());
        assertEquals(52L, subscribedCategory.getSelections().get(0).getId().intValue());
        assertEquals(56L, subscribedCategory.getSelections().get(1).getId().intValue());
        assertEquals(2, subscribedCategory.getProjects().size());
        assertEquals(11L, subscribedCategory.getProjects().get(0).getId().intValue());
        assertEquals(11L, subscribedCategory.getProjects().get(1).getId().intValue());
        unsubscribeCategory(15L, 257L, 1);
        unsubscribeCategory(13L, 52L, 1);
        unsubscribeCategory(13L, 56L, 0);
    }

    private List<SubscribedCategory> getUserSubscribedCategories() throws Exception {
        ResponseEntity<SubscribedCategory[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + WorkflowController.SUBSCRIBED_CATEGORIES_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                SubscribedCategory[].class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        SubscribedCategory[] subscribedCategories = response.getBody();
        assertNotNull(subscribedCategories);
        return Arrays.asList(response.getBody());
    }

    private List<SubscribedCategory> unsubscribeCategory(Long categoryId, Long selectionId, int expected) throws Exception {
        CategoryUnsubscribeParams categoryUnsubscribeParams = new CategoryUnsubscribeParams();
        categoryUnsubscribeParams.setSelectionId(selectionId);
        ResponseEntity<SubscribedCategory[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + CategoryController.CATEGORY_UNSUBSCRIBE_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(categoryUnsubscribeParams, USER),
                SubscribedCategory[].class,
                categoryId);
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody().length);
        return Arrays.asList(response.getBody());

    }

    /**
     * Tests {@link WorkflowController#getUserSampleTasks()}
     * Tests {@link WorkflowController#removeUserSampleTasks(RemoveUserSampleTasksParams)}
     */
    @Test
    @Order(3)
    public void testUserSampleTasks() throws Exception {
        List<SampleTask> sampleTasks = getUserSampleTasksWorkflow();
        SampleTask sampleTask = sampleTasks.get(0);
        assertEquals("Spartacus Acquisition Corporation (TMTSU) goes public on 2020-10-15", sampleTask.getName());
        assertEquals("America/New_York", sampleTask.getTimeZone());
        assertEquals("2020-09-28", sampleTask.getDueDate());
        assertEquals("21:43", sampleTask.getDueTime());
        assertEquals(true, sampleTask.isPending());
        removeUserSampleTasksWorkflow(sampleTask.getId());
    }

    private List<SampleTask> getUserSampleTasksWorkflow() throws Exception {
        ResponseEntity<SampleTask[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + WorkflowController.USER_SAMPLE_TASKS_ROUTE,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                SampleTask[].class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        SampleTask[] sampleTasks = response.getBody();
        assertNotNull(sampleTasks);
        return Arrays.asList(response.getBody());
    }

    private List<SampleTask> removeUserSampleTasksWorkflow(Long sampleTaskId) throws Exception {
        RemoveUserSampleTasksParams removeUserSampleTasksParams = new RemoveUserSampleTasksParams();
        removeUserSampleTasksParams.setProjectId(5L);
        removeUserSampleTasksParams.setAssignees(ImmutableList.of("BulletJournal", "Scarlet"));
        removeUserSampleTasksParams.setLabels(ImmutableList.of(1L, 2L));
        removeUserSampleTasksParams.setTimezone("");
        removeUserSampleTasksParams.setStartDate("2020-10-01");
        removeUserSampleTasksParams.setReminderBefore(5);
        removeUserSampleTasksParams.setSampleTasks(ImmutableList.of(sampleTaskId));
        ResponseEntity<SampleTask[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + WorkflowController.REMOVE_USER_SAMPLE_TASKS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(removeUserSampleTasksParams, USER),
                SampleTask[].class);
        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().length);
        return Arrays.asList(response.getBody());

    }

    private List<SampleTask> checkImportTasksParamsWorkflow(ImportTasksParams importTasksParams) throws Exception {
        ResponseEntity<SampleTask[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + WorkflowController.SAMPLE_TASKS_IMPORT_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(importTasksParams, USER),
                SampleTask[].class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<SampleTask> sampleTasks = Arrays.asList(response.getBody());
        assertNotNull(sampleTasks);
        assertEquals(18, sampleTasks.size());

        // Get Tasks
        ResponseEntity<Task[]> tasksResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.GET,
                null,
                Task[].class,
                16);
        List<Task> tasks = Arrays.asList(tasksResponse.getBody());
        assertEquals(18, tasks.size());
//        Thread.sleep(3000);
        for (int i = 0; i < 16; i++) {
            Task task = tasks.get(i);
            assertEquals("America/Los_Angeles", task.getTimezone());
            assertEquals("2020-10-0" + (i / 4 + 1), task.getDueDate());
            assertEquals(18 + (i % 4) + ":00", task.getDueTime());
            assertEquals(1, task.getReminderSetting().getBefore().intValue());
            assertEquals(60, task.getDuration().intValue());
            assertNull(task.getRecurrenceRule());
            assertNull(task.getStatus());

            ResponseEntity<Content[]> contentResponse = this.restTemplate.exchange(
                    ROOT_URL + randomServerPort + TaskController.CONTENTS_ROUTE,
                    HttpMethod.GET,
                    null,
                    Content[].class,
                    task.getId());

            assertEquals(HttpStatus.OK, contentResponse.getStatusCode());
            Content[] contents = contentResponse.getBody();
            //assertEquals(1, contents.length);
//            Content content = contents[0];
//            assertEquals("BulletJournal", content.getOwner().getName());
//            assertNotNull(content.getId());
//            assertNotNull(content.getText());
//            assertTrue(content.getText().contains(DeltaContent.DELTA));
//            assertTrue(content.getText().contains(DeltaContent.HTML_TAG));
        }
        return sampleTasks;
    }

    /**
     * Tests {@link WorkflowController#getNext(Long, List, List, boolean)}
     */
    @Test
    @Order(2)
    public void testWorkflowGetNext() {
        CreateStepParams createStepParams1 = new CreateStepParams();
        createStepParams1.setName("step1");
        Step step1 = createStep(createStepParams1);
        CreateStepParams createStepParams2 = new CreateStepParams();
        createStepParams2.setName("step2");
        Step step2 = createStep(createStepParams2);
        CreateRuleParams createRuleParams = new CreateRuleParams();
        createRuleParams.setName("rule1");
        createRuleParams.setPriority(10);
        createRuleParams.setStepId(step1.getId());
        createRuleParams.setConnectedStepId(step2.getId());
        createRuleParams.setRuleExpression("{\"rule\":[{\"condition\":\"CONTAINS\",\"selectionIds\":[1,2,3,4]},{\"condition\":\"CONTAINS\",\"selectionIds\":[3,4,5,6]}],\"logicOperator\":\"AND\"}");
        createRule(createRuleParams);
        checkWorkflow(step1.getId(), step2.getId(), Arrays.asList(1L, 2L, 3L, 4L, 5L, 6L), false);

        CreateCategoryParams createCategoryParams = new CreateCategoryParams();
        createCategoryParams.setNextStepId(step1.getId());
        createCategoryParams.setName("category1");
        createCategoryParams.setNeedStartDate(false);
        Category category = createCategory(createCategoryParams);
        CreateRuleParams createRuleParams2 = new CreateRuleParams();
        createRuleParams2.setName("rule2");
        createRuleParams2.setPriority(11);
        createRuleParams2.setCategoryId(category.getId());
        createRuleParams2.setConnectedStepId(step2.getId());
        createRuleParams2.setRuleExpression("{\"rule\":[{\"condition\":\"EXACT\",\"selectionIds\":[1,2,3,4]},{\"condition\":\"CONTAINS\",\"selectionIds\":[3,4,5,6]}],\"logicOperator\":\"OR\"}");
        createRule(createRuleParams2);
        checkWorkflow(category.getId(), step2.getId(), Arrays.asList(1L, 2L, 3L, 4L), true);
    }

    private void checkWorkflow(Long id, Long matchId, List<Long> selections, boolean categorOrStep) {
        String url = UriComponentsBuilder.fromHttpUrl(
                ROOT_URL + randomServerPort + WorkflowController.NEXT_STEP_ROUTE)
                .queryParam("selections", selections)
                .queryParam("first", categorOrStep)
                .buildAndExpand(id).toUriString();
        ResponseEntity<NextStep> response = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                TestHelpers.actAsOtherUser(null, USER),
                NextStep.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        NextStep nextStep = response.getBody();
        assertNotNull(nextStep);
        assertEquals(nextStep.getStep().getId(), matchId);
    }

    private Step createStep(CreateStepParams createStepParams) {
        ResponseEntity<Step> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + StepController.STEPS_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(createStepParams, USER),
                Step.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Step step = response.getBody();
        assertNotNull(step);
        return step;
    }

    private Category createCategory(CreateCategoryParams createCategoryParams) {
        ResponseEntity<Category> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + CategoryController.CATEGORIES_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(createCategoryParams, USER),
                Category.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Category category = response.getBody();
        assertNotNull(category);
        return category;
    }

    private void createRule(CreateRuleParams createRuleParams) {
        ResponseEntity<Rule> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + RuleController.RULES_ROUTE,
                HttpMethod.POST,
                TestHelpers.actAsOtherUser(createRuleParams, USER),
                Rule.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Rule rule = response.getBody();
        assertNotNull(rule);
    }
}
