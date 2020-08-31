package com.bulletjournal.templates.controller;

import com.bulletjournal.templates.controller.model.Choice;
import com.bulletjournal.templates.repository.ChoiceDaoJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ChoiceController {
    public static final String CHOICES_ROUTE = "/api/choices";

    public static final String CHOICE_ROUTE = "/api/choices/{choiceId}";

    public static final String PUBLIC_CHOICES_ROUTE = "/api/public/choices";

    public static final String PUBLIC_CHOICE_ROUTE = "/api/public/choices/{choiceId}";

    @Autowired
    private ChoiceDaoJpa choiceDaoJpa;

    @GetMapping(PUBLIC_CHOICES_ROUTE)
    public List<Choice> getChoices() {
        return choiceDaoJpa.getAllChoices().stream().map(
                com.bulletjournal.templates.repository.model.Choice::toPresentationModel).collect(
                        Collectors.toList());
    }

    @GetMapping(PUBLIC_CHOICE_ROUTE)
    public Choice getChoice(@NotNull @PathVariable Long choiceId) {
        return choiceDaoJpa.getById(choiceId).toPresentationModel();
    }
}
