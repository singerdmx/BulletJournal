package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateLabelParams;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.UpdateLabelParams;
import com.bulletjournal.repository.LabelDaoJap;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class LabelController {

    protected static final String LABELS_ROUTE = "/api/labels";
    protected static final String ITEMS_ROUTE = "/api/items";

    @Autowired
    private LabelDaoJap labelDaoJap;

    @PostMapping(LABELS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Label createLabel(@Valid @RequestBody CreateLabelParams label) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return labelDaoJap.create(label.getValue(), username).toPresentationModel();
    }

    @PatchMapping(LABELS_ROUTE)
    public Label updateLabel(@NotNull @PathVariable Long labelId,
                             @Valid @RequestBody UpdateLabelParams updateLabelParams) {
        return null;
    }

    @DeleteMapping(LABELS_ROUTE)
    public ResponseEntity<?> deleteLabel(@PathVariable Long labelId) {
        return null;
    }

    @GetMapping(ITEMS_ROUTE)
    public List<ProjectItems> getItemsByLabels(@Valid @RequestParam List<Long> labels) {
        return null;
    }
}
