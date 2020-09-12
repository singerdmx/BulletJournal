package com.bulletjournal.templates;

import com.bulletjournal.controller.utils.TestHelpers;
import com.bulletjournal.templates.controller.CategoryController;
import com.bulletjournal.templates.controller.RuleController;
import com.bulletjournal.templates.controller.StepController;
import com.bulletjournal.templates.controller.WorkflowController;
import com.bulletjournal.templates.controller.model.*;
import org.junit.Before;
import org.junit.Test;
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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

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

    @Test
    public void testWorkflow() {
        CreateStepParams createStepParams1 = new CreateStepParams();
        createStepParams1.setName("step1");
        Step step1 = createStep(createStepParams1);
        CreateStepParams createStepParams2 = new CreateStepParams();
        createStepParams2.setName("step2");
        Step step2 = createStep(createStepParams2);
        CreateRuleParams createRuleParams = new CreateRuleParams();
        createRuleParams.setName("rule1");
        createRuleParams.setStepId(step1.getId());
        createRuleParams.setConnectedStepId(step2.getId());
        createRuleParams.setRuleExpression("{\"rule\":[{\"condition\":\"CONTAINS\",\"selectionIds\":[1,2,3,4]},{\"condition\":\"CONTAINS\",\"selectionIds\":[3,4,5,6]}],\"logicOperator\":\"AND\"}");
        createRule(createRuleParams);
        checkWorkflow(step1.getId(), step2.getId(), Arrays.asList(3L, 4L), false);

        CreateCategoryParams createCategoryParams = new CreateCategoryParams();
        createCategoryParams.setNextStepId(step1.getId());
        createCategoryParams.setName("category1");
        Category category = createCategory(createCategoryParams);
        CreateRuleParams createRuleParams2 = new CreateRuleParams();
        createRuleParams2.setName("rule2");
        createRuleParams2.setCategoryId(category.getId());
        createRuleParams2.setConnectedStepId(step2.getId());
        createRuleParams2.setRuleExpression("{\"rule\":[{\"condition\":\"EXACT\",\"selectionIds\":[1,2,3,4]},{\"condition\":\"CONTAINS\",\"selectionIds\":[3,4,5,6]}],\"logicOperator\":\"OR\"}");
        createRule(createRuleParams2);
        checkWorkflow(category.getId(), step2.getId(), Arrays.asList(3L, 4L), true);
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
