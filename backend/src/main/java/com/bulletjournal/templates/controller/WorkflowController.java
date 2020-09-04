package com.bulletjournal.templates.controller;

import com.bulletjournal.templates.controller.model.NextStep;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class WorkflowController {

    public static final String NEXT_STEP_ROUTE = "/api/public/steps/{stepId}/next";

    @GetMapping(NEXT_STEP_ROUTE)
    public NextStep getNext(
            @NotNull @PathVariable Long stepId,
            @NotNull @RequestParam List<Long> selections,
            @NotNull @RequestParam(required = false, defaultValue = "false") boolean first
    ) {
        return null;
    }
}
