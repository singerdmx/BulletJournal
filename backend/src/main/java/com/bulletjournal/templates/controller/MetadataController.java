package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.*;
import com.bulletjournal.templates.repository.*;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class MetadataController {
    @Autowired
    private UserDaoJpa userDaoJpa;

    public static final String CHOICE_METADATA_ROUTE = "/api/choiceMetadata";
    public static final String STEP_METADATA_ROUTE = "/api/stepMetadata";
    public static final String SELECTION_METADATA_ROUTE = "/api/selectionMetadata";
    public static final String CHOICES_METADATA_ROUTE = "/api/choiceMetadata/{keyword}";
    public static final String STEPS_METADATA_ROUTE = "/api/stepMetadata/{keyword}";
    public static final String SELECTIONS_METADATA_ROUTE = "/api/selectionMetadata/{keyword}";

    @Autowired
    private ChoiceMetadataKeywordRepository choiceMetadataKeywordRepository;

    @Autowired
    private ChoiceMetadataKeywordDaoJpa choiceMetadataKeywordDaoJpa;

    @Autowired
    private StepMetadataKeywordRepository stepMetadataKeywordRepository;

    @Autowired
    private SelectionMetadataKeywordRepository selectionMetadataKeywordRepository;

    @Autowired
    private SelectionMetadataKeywordDaoJpa selectionMetadataKeywordDaoJpa;

    @Autowired
    private StepMetadataKeywordDaoJpa stepMetadataKeywordDaoJpa;

    @GetMapping(CHOICE_METADATA_ROUTE)
    public List<ChoiceMetadata> getChoiceMetadata() {
        validateRequester();
        return this.choiceMetadataKeywordRepository.findAll()
                .stream().map(c -> c.toPresentationModel())
                .sorted(Comparator.comparing(c -> c.getChoice().getId()))
                .collect(Collectors.toList());
    }

    @GetMapping(STEP_METADATA_ROUTE)
    public List<StepMetadata> getStepMetadata() {
        validateRequester();
        return this.stepMetadataKeywordRepository.findAll()
                .stream().map(c -> c.toPresentationModel())
                .sorted(Comparator.comparing(c -> c.getStep().getId()))
                .collect(Collectors.toList());
    }

    @GetMapping(SELECTION_METADATA_ROUTE)
    public List<SelectionMetadata> getSelectionMetadata() {
        validateRequester();
        return this.selectionMetadataKeywordRepository.findAll()
                .stream().map(c -> c.toPresentationModel())
                .sorted(Comparator.comparing(c -> c.getSelection().getId()))
                .collect(Collectors.toList());
    }

    @PostMapping(CHOICE_METADATA_ROUTE)
    public List<ChoiceMetadata> createChoiceMetadata(@NotNull @RequestBody CreateChoiceMetadataParams params) {
        validateRequester();
        this.choiceMetadataKeywordDaoJpa.save(params.getChoiceId(), params.getKeyword())
                .toPresentationModel();
        return getChoiceMetadata();
    }

    @PostMapping(SELECTION_METADATA_ROUTE)
    public List<SelectionMetadata> createSelectionMetadata(@NotNull @RequestBody CreateSelectionMetadataParams params) {
        validateRequester();
        this.selectionMetadataKeywordDaoJpa.save(params.getSelectionId(), params.getKeyword(), params.getFrequency()).toPresentationModel();
        return getSelectionMetadata();
    }

    @PostMapping(STEP_METADATA_ROUTE)
    public List<StepMetadata> createStepMetadata(@NotNull @RequestBody CreateStepMetadataParams params) {
        validateRequester();
        this.stepMetadataKeywordDaoJpa.save(params.getStepId(), params.getKeyword()).toPresentationModel();
        return getStepMetadata();
    }

    @DeleteMapping(CHOICE_METADATA_ROUTE)
    public List<ChoiceMetadata> deleteChoiceMetadata(@Valid @RequestParam List<String> keywords) {
        validateRequester();
        choiceMetadataKeywordDaoJpa.deleteByKeywords(keywords);
        return getChoiceMetadata();
    }

    @DeleteMapping(STEP_METADATA_ROUTE)
    public List<StepMetadata> deleteStepMetadata(@Valid @RequestParam List<String> keywords) {
        validateRequester();
        stepMetadataKeywordDaoJpa.deleteByKeywords(keywords);
        return getStepMetadata();
    }

    @DeleteMapping(SELECTION_METADATA_ROUTE)
    public List<SelectionMetadata> deleteSelectionMetadata(@Valid @RequestParam List<String> keywords) {
        validateRequester();
        selectionMetadataKeywordDaoJpa.deleteByKeywords(keywords);
        return getSelectionMetadata();
    }

    @PutMapping(CHOICES_METADATA_ROUTE)
    public List<ChoiceMetadata> updateChoiceMetadata(@NotNull @PathVariable String keyword, @Valid @RequestBody UpdateChoiceMetadataKeywordsParams params) {
        validateRequester();
        choiceMetadataKeywordDaoJpa.updateByKeyword(keyword, params.getChoiceId()).toPresentationModel();
        return getChoiceMetadata();
    }

    @PutMapping(SELECTIONS_METADATA_ROUTE)
    public List<SelectionMetadata> updateSelectionMetadata(@NotNull @PathVariable String keyword, @Valid @RequestBody UpdateSelectionMetadataKeywordsParams params) {
        validateRequester();
        selectionMetadataKeywordDaoJpa.updateByKeyword(keyword, params.getSelectionId(), params.getFrequency()).toPresentationModel();
        return getSelectionMetadata();
    }

    @PutMapping(STEPS_METADATA_ROUTE)
    public List<StepMetadata> updateStepMetadata(@NotNull @PathVariable String keyword, @Valid @RequestBody UpdateStepMetadataKeywordsParams params) {
        validateRequester();
        stepMetadataKeywordDaoJpa.updateByKeyword(keyword, params.getStepId()).toPresentationModel();
        return getStepMetadata();
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
