package com.bulletjournal.controller;

import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.ProjectType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
public class ProjectItemController {

    protected static final String PROJECT_ITEMS_ROUTE = "/api/projectItems";

    @GetMapping(PROJECT_ITEMS_ROUTE)
    public ProjectItems getProjectItems(@Valid @RequestParam List<ProjectType> types) {
        return null;
    }
}
