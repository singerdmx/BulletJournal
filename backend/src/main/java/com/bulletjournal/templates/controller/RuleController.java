package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.repository.RuleDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@RestController
public class RuleController {

    public static final String RULES_ROUTE = "/api/rules";

    public static final String RULE_ROUTE = "/api/rules/{ruleId}";


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
            return ruleDaoJpa.createCategoryRule(params.getCategoryId(), params.getName(), params.getPriority(), params.getRuleExpression(), params.getConnectedStepId()).toPresentationModel();
        } else {
            return ruleDaoJpa.createStepRule(params.getStepId(), params.getName(), params.getPriority(), params.getRuleExpression(), params.getConnectedStepId()).toPresentationModel();
        }
    }

    @GetMapping(RULE_ROUTE)
    public Rule getRule(@NotNull @PathVariable Long ruleId, @NotNull @RequestParam RuleType ruleType) {
        validateRequester();
        switch (ruleType) {
            case CATEGORY_RULE:
                return ruleDaoJpa.getCategoryRuleById(ruleId).toPresentationModel();
            case STEP_RULE:
                return ruleDaoJpa.getStepRuleById(ruleId).toPresentationModel();
            default:
                throw new BadRequestException("ruleType not match CategoryRule and StepRule");
        }
    }

    @DeleteMapping(RULE_ROUTE)
    public void deleteRule(@NotNull @PathVariable Long ruleId, @NotNull @RequestParam RuleType ruleType) {
        validateRequester();
        switch (ruleType) {
            case CATEGORY_RULE:
                ruleDaoJpa.deleteCategoryRuleById(ruleId);
                break;
            case STEP_RULE:
                ruleDaoJpa.deleteStepRuleById(ruleId);
                break;
            default:
                throw new BadRequestException("ruleType not match CategoryRule and StepRule");
        }
    }

    @PutMapping(RULE_ROUTE)
    public Rule updateRule(@NotNull @PathVariable Long ruleId, @Valid @RequestBody UpdateRuleParams updateRuleParams) {
        validateRequester();
        if (updateRuleParams.getCategoryId() == null && updateRuleParams.getStepId() == null) {
            throw new BadRequestException("category id and step id both null");
        }
        if (updateRuleParams.getCategoryId() != null && updateRuleParams.getStepId() != null) {
            throw new BadRequestException("category id and step id both not null");
        }
        if (updateRuleParams.getCategoryId() != null) {
            return ruleDaoJpa.updateCategoryRule(ruleId, updateRuleParams.getCategoryId(), updateRuleParams.getName(),
                    updateRuleParams.getPriority(), updateRuleParams.getRuleExpression(), updateRuleParams.getConnectedStepId()).toPresentationModel();
        } else {
            return ruleDaoJpa.updateStepRule(ruleId, updateRuleParams.getStepId(), updateRuleParams.getName(),
                    updateRuleParams.getPriority(), updateRuleParams.getRuleExpression(), updateRuleParams.getConnectedStepId()).toPresentationModel();
        }
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
