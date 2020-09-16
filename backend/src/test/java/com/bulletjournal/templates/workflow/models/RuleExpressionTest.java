package com.bulletjournal.templates.workflow.models;

import com.google.gson.Gson;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class RuleExpressionTest {
    @Test
    public void test() {
        String expectedJson = "{\"rule\":[{\"condition\":\"CONTAINS\",\"selectionIds\":[1,2,3]},{\"condition\":\"CONTAINS\",\"selectionIds\":[4,5,6]}],\"logicOperator\":\"AND\"}";
        List<RuleExpression.Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(new RuleExpression.Criteria(RuleExpression.Condition.CONTAINS, Arrays.asList(1L, 2L, 3L)));
        criteriaList.add(new RuleExpression.Criteria(RuleExpression.Condition.CONTAINS, Arrays.asList(4L, 5L, 6L)));

        RuleExpression ruleExpression = new RuleExpression(criteriaList, RuleExpression.LogicOperator.AND);
        Assert.assertEquals(expectedJson, new Gson().toJson(ruleExpression));


        String inputJson = expectedJson;
        RuleExpression deSerializedRuleExpression = new Gson().fromJson(inputJson, RuleExpression.class);
        Assert.assertEquals(2, deSerializedRuleExpression.getCriteriaList().size());
    }

}