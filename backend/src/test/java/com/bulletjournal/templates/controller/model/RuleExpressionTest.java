package com.bulletjournal.templates.controller.model;

import com.google.gson.Gson;
import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;

public class RuleExpressionTest {

    @Test
    public void test() {
        String expectedJson = "{\"rule\":{\"choiceId\":1,\"condition\":\"CONTAINS\",\"selectionIds\":[1,2,3]}}";
        RuleExpression ruleExpression = new RuleExpression(new RuleExpression.Criteria(1L, RuleExpression.Condition.CONTAINS, Arrays.asList(1L, 2L, 3L)));
        Assert.assertEquals(expectedJson, new Gson().toJson(ruleExpression));


        String inputJson = expectedJson;
        RuleExpression deSerializedRuleExpression = new Gson().fromJson(inputJson, RuleExpression.class);
        System.out.println("hi");
    }

}