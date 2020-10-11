package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.repository.SelectionDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class SelectionController {

    public static final String SELECTIONS_ROUTE = "/api/choices/{choiceId}/selections";
    public static final String CHOICE_SELECTION_INTRODUCTIONS_ROUTE = "/api/choices/{choiceId}/selectionIntroductions";
    public static final String SELECTION_ROUTE = "/api/selections/{selectionId}";
    public static final String PUBLIC_SELECTION_ROUTE = "/api/public/selections/{selectionId}";
    public static final String SELECTION_INTRODUCTIONS_ROUTE = "/api/selections/{selectionId}/introductions";
    public static final String SELECTION_INTRODUCTION_ROUTE = "/api/selectionIntroductions/{selectionIntroductionId}";
    private final UserDaoJpa userDaoJpa;
    private final SelectionDaoJpa selectionDaoJpa;

    @Autowired
    public SelectionController(UserDaoJpa userDaoJpa,
                               SelectionDaoJpa selectionDaoJpa) {
        this.userDaoJpa = userDaoJpa;
        this.selectionDaoJpa = selectionDaoJpa;
    }

    @PostMapping(SELECTIONS_ROUTE)
    public Selection createSelection(@NotNull @PathVariable Long choiceId,
                                     @NotNull @RequestBody CreateSelectionParams params) {
        validateRequester();
        return this.selectionDaoJpa.save(choiceId, params.getIcon(), params.getText()).toPresentationModel();
    }

    @PostMapping(SELECTION_INTRODUCTIONS_ROUTE)
    public List<SelectionIntroduction> createSelectionIntroduction(
            @NotNull @PathVariable Long selectionId, @NotNull @RequestBody CreateSelectionIntroductionParams params) {
        validateRequester();
        long choiceId = this.selectionDaoJpa.saveSelectionIntroduction(selectionId, params.getImageLink(), params.getDescription(), params.getTitle());
        return getSelectionIntroductions(choiceId);
    }

    @DeleteMapping(SELECTION_INTRODUCTION_ROUTE)
    public void deleteSelectionIntroduction(@NotNull @PathVariable Long selectionIntroductionId) {
        validateRequester();
        this.selectionDaoJpa.deleteIntroductionById(selectionIntroductionId);
    }

    @PutMapping(SELECTION_INTRODUCTION_ROUTE)
    public List<SelectionIntroduction> updateSelectionIntroduction(@NotNull @PathVariable Long selectionIntroductionId,
                                                                   @NotNull @RequestBody UpdateSelectionIntroductionParams params) {
        validateRequester();
        long choiceId = this.selectionDaoJpa.updateSelectionIntroduction(selectionIntroductionId, params.getImageLink(), params.getDescription(), params.getTitle());
        return getSelectionIntroductions(choiceId);
    }

    @GetMapping(PUBLIC_SELECTION_ROUTE)
    public Selection getSelection(@NotNull @PathVariable Long selectionId) {
        return this.selectionDaoJpa.getById(selectionId).toPresentationModel();
    }

    @PutMapping(SELECTION_ROUTE)
    public Selection updateSelection(@NotNull @PathVariable Long selectionId,
                                     @NotNull @RequestBody UpdateSelectionParams params) {
        validateRequester();
        com.bulletjournal.templates.repository.model.Selection selection = this.selectionDaoJpa.getById(selectionId);
        selection.setIcon(params.getIcon());
        selection.setText(params.getText());
        this.selectionDaoJpa.save(selection);
        return this.selectionDaoJpa.getById(selectionId).toPresentationModel();
    }

    @DeleteMapping(SELECTION_ROUTE)
    public void deleteSelection(@NotNull @PathVariable Long selectionId) {
        validateRequester();
        this.selectionDaoJpa.deleteById(selectionId);
    }

    @GetMapping(CHOICE_SELECTION_INTRODUCTIONS_ROUTE)
    public List<SelectionIntroduction> getSelectionIntroductions(@NotNull @PathVariable Long choiceId) {
        validateRequester();
        return selectionDaoJpa.getSelectionIntroductionsByChoiceId(choiceId);
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
