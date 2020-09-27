package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.NamedModel;
import com.bulletjournal.templates.controller.model.Choice;
import com.bulletjournal.templates.controller.model.CreateChoiceParams;
import com.bulletjournal.templates.controller.model.UpdateChoiceParams;
import com.bulletjournal.templates.repository.ChoiceDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ChoiceController {
    public static final String CHOICES_ROUTE = "/api/choices";

    public static final String CHOICE_ROUTE = "/api/choices/{choiceId}";

    public static final String PUBLIC_CHOICES_ROUTE = "/api/public/choices";

    public static final String PUBLIC_CHOICE_ROUTE = "/api/public/choices/{choiceId}";

    private final UserDaoJpa userDaoJpa;
    private final ChoiceDaoJpa choiceDaoJpa;

    @Autowired
    public ChoiceController(UserDaoJpa userDaoJpa,
                            ChoiceDaoJpa choiceDaoJpa) {
        this.userDaoJpa = userDaoJpa;
        this.choiceDaoJpa = choiceDaoJpa;
    }

    @GetMapping(PUBLIC_CHOICES_ROUTE)
    public List<Choice> getChoices() {
        return choiceDaoJpa.getAllChoices().stream()
                .sorted(Comparator.comparing(NamedModel::getName))
                .map(com.bulletjournal.templates.repository.model.Choice::toPresentationModel)
                .collect(Collectors.toList());
    }

    @GetMapping(PUBLIC_CHOICE_ROUTE)
    public Choice getChoice(@NotNull @PathVariable Long choiceId) {
        return choiceDaoJpa.getChoiceByIdWithCategoriesSelectionsSteps(choiceId);
    }

    @PostMapping(CHOICES_ROUTE)
    public Choice createChoice(@Valid @RequestBody CreateChoiceParams params) {
        validateRequester();
        return this.choiceDaoJpa.save(params.getName(), params.isMultiple(), params.isInstructionIncluded()).toPresentationModel();
    }

    @PutMapping(CHOICE_ROUTE)
    public Choice updateChoice(@NotNull @PathVariable Long choiceId,
                               @Valid @RequestBody UpdateChoiceParams params) {
        validateRequester();

        com.bulletjournal.templates.repository.model.Choice choice = choiceDaoJpa.getById(choiceId);
        choice.setName(params.getName());
        choice.setMultiple(params.isMultiple());
        choice.setInstructionIncluded(params.isInstructionIncluded());

        this.choiceDaoJpa.save(choice);
        return this.choiceDaoJpa.getById(choiceId).toPresentationModel();
    }

    @DeleteMapping(CHOICE_ROUTE)
    public List<Choice> deleteChoice(@NotNull @PathVariable Long choiceId) {
        validateRequester();
        this.choiceDaoJpa.deleteById(choiceId);
        return getChoices();
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
