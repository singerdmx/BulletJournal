package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateLabelParams;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.UpdateLabelParams;
import com.bulletjournal.repository.LabelDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class LabelController {

    protected static final String LABELS_ROUTE = "/api/labels";
    protected static final String LABEL_ROUTE = "/api/labels/{labelId}";
    protected static final String ITEMS_ROUTE = "/api/items";

    @Autowired
    private LabelDaoJpa labelDaoJpa;

    @PostMapping(LABELS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Label createLabel(@Valid @RequestBody CreateLabelParams label) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return labelDaoJpa.create(label.getValue(), username).toPresentationModel();
    }

    @PatchMapping(LABEL_ROUTE)
    public Label updateLabel(@NotNull @PathVariable Long labelId,
                             @Valid @RequestBody UpdateLabelParams updateLabelParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return labelDaoJpa.partialUpdate(username, labelId, updateLabelParams).toPresentationModel();
    }

    @GetMapping(LABEL_ROUTE)
    public Label getLabel(@NotNull @PathVariable Long labelId) {
        return this.labelDaoJpa.getLabel(labelId).toPresentationModel();
    }

    @GetMapping(LABELS_ROUTE)
    public ResponseEntity<List<Label>> getLabels() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Label> labels = this.labelDaoJpa.getLabels(username)
                .stream().map(label -> label.toPresentationModel())
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(labels);
    }

    @DeleteMapping(LABEL_ROUTE)
    public ResponseEntity<?> deleteLabel(@NotNull @PathVariable Long labelId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.labelDaoJpa.delete(labelId, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping(ITEMS_ROUTE)
    public List<ProjectItems> getItemsByLabels(@Valid @RequestParam List<Long> labels) {
        return null;
    }
}
