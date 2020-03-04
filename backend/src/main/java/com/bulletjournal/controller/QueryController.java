package com.bulletjournal.controller;

import com.bulletjournal.controller.models.ProjectItems;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@RestController
public class QueryController {

    protected static final String SEARCH_ROUTE = "/api/query";

    @GetMapping(SEARCH_ROUTE)
    public List<ProjectItems> searchItems(@Valid @RequestParam @NotBlank String term) {
        return null;
    }
}
