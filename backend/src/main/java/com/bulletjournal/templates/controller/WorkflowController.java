package com.bulletjournal.templates.controller;

import com.bulletjournal.templates.controller.model.CreateSampleTaskParams;
import com.bulletjournal.templates.controller.model.NextStep;
import com.bulletjournal.templates.controller.model.SampleTask;
import com.bulletjournal.templates.repository.SampleTaskDaoJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class WorkflowController {

    public static final String NEXT_STEP_ROUTE = "/api/public/steps/{stepId}/next";
    public static final String SAMPLE_TASKS_ROUTE = "/api/sampletasks";

    @Autowired
    SampleTaskDaoJpa sampleTaskDaoJpa;

    @GetMapping(NEXT_STEP_ROUTE)
    public NextStep getNext(
            @NotNull @PathVariable Long stepId,
            @NotNull @RequestParam List<Long> selections,
            @NotNull @RequestParam(required = false, defaultValue = "false") boolean first
    ) {
        return null;
    }

    @PostMapping(SAMPLE_TASKS_ROUTE)
    public SampleTask createSampleTask(@Valid @RequestBody CreateSampleTaskParams createSampleTaskParams) {
        return sampleTaskDaoJpa.createSampleTask(createSampleTaskParams).toPresentationModel();
    }
}
