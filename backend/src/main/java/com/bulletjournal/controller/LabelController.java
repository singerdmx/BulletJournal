package com.bulletjournal.controller;

import com.bulletjournal.controller.models.CreateLabelParams;
import com.bulletjournal.controller.models.Label;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
public class LabelController {

    protected static final String LABELS_ROUTE = "/api/labels";
    protected static final String LABEL_ROUTE = "/api/labels/{labelId}";

    @GetMapping(LABELS_ROUTE)
    public List<Label> getLabels() {
        return null;
    }

    @PostMapping(LABEL_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Label createLabel(@Valid @RequestBody CreateLabelParams createLabelParams) {
        return null;
    }
}
