package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.repository.RuleDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class RuleController {

    public static final String RULES_ROUTE = "/api/rules";

    public static final String RULE_ROUTE = "/api/rules/{ruleId}";

    public static final String PUBLIC_RULES_ROUTE = "/api/public/rules";

    public static final String PUBLIC_RULE_ROUTE = "/api/public/rules/{ruleId}";

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private RuleDaoJpa ruleDaoJpa;

    @PostMapping(RULES_ROUTE)
    public Rule createRule(@Valid @RequestBody CreateRuleParams params) {
        validateRequester();
        if (params.getCategoryId() == null && params.getStepId() == null) {
            throw new BadRequestException("category id and step id both null");
        }
        if (params.getCategoryId() != null && params.getStepId() != null) {
            throw new BadRequestException("category id and step id both not null");
        }
        if (params.getCategoryId() != null) {
            return ruleDaoJpa.createCategoryRule(params.getCategoryId(), params.getName(), params.getPriority(), params.getRuleExpression()).toPresentationRule();
        } else {
            return ruleDaoJpa.createStepRule(params.getStepId(), params.getName(), params.getPriority(), params.getRuleExpression()).toPresentationRule();
        }
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
