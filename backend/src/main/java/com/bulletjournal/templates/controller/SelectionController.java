package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.CreateSelectionParams;
import com.bulletjournal.templates.controller.model.Selection;
import com.bulletjournal.templates.controller.model.UpdateSelectionParams;
import com.bulletjournal.templates.repository.SelectionDaoJpa;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;

@RestController
public class SelectionController {

    public static final String SELECTIONS_ROUTE = "/api/choices/{choiceId}/selections";
    public static final String SELECTION_ROUTE = "/api/selections/{selectionId}";
    public static final String PUBLIC_SELECTION_ROUTE = "/api/public/selections/{selectionId}";

    private final UserDaoJpa userDaoJpa;
    private final SelectionDaoJpa selectionDaoJpa;

    SelectionController(UserDaoJpa userDaoJpa,
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

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
