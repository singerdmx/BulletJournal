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
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class MetadataController {
    @Autowired
    private UserDaoJpa userDaoJpa;

    public static final String CHOICE_METADATA_ROUTE = "/api/choiceMetadata";
    public static final String STEP_METADATA_ROUTE = "/api/stepMetadata";
    public static final String SELECTION_METADATA_ROUTE = "/api/selectionMetadata";
    public static final String CHOICES_METADATA_ROUTE = "/api/choicesMetadata/{keyword}";
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
                .stream().map(c -> c.toPresentationModel()).collect(Collectors.toList());
    }

    @GetMapping(STEP_METADATA_ROUTE)
    public List<StepMetadata> getStepMetadata() {
        validateRequester();
        return this.stepMetadataKeywordRepository.findAll()
                .stream().map(c -> c.toPresentationModel()).collect(Collectors.toList());
    }

    @GetMapping(SELECTION_METADATA_ROUTE)
    public List<SelectionMetadata> getSelectionMetadata() {
        validateRequester();
        return this.selectionMetadataKeywordRepository.findAll()
                .stream().map(c -> c.toPresentationModel()).collect(Collectors.toList());
    }

    @PostMapping(CHOICE_METADATA_ROUTE)
    public ChoiceMetadata createChoiceMetadata(@NotNull @RequestBody CreateChoiceMetadataParams params) {
        validateRequester();
        return this.choiceMetadataKeywordDaoJpa.save(params.getChoiceId(), params.getKeyword())
                .toPresentationModel();
    }

    @PostMapping(SELECTION_METADATA_ROUTE)
    public SelectionMetadata createSelectionMetadata(@NotNull @RequestBody CreateSelectionMetadataParams params) {
        validateRequester();
        return this.selectionMetadataKeywordDaoJpa.save(params.getSelectionId(), params.getKeyword()).toPresentationModel();
    }

    @PostMapping(STEP_METADATA_ROUTE)
    public StepMetadata createStepMetadata(@NotNull @RequestBody CreateStepMetadataParams params) {
        validateRequester();
        return this.stepMetadataKeywordDaoJpa.save(params.getStepId(), params.getKeyword()).toPresentationModel();
    }

    @DeleteMapping(CHOICES_METADATA_ROUTE)
    public void deleteChoiceMetadataRoute(@NotNull @PathVariable String keyword) {
        validateRequester();
        choiceMetadataKeywordDaoJpa.deleteByKeyword(keyword);

    }

    @DeleteMapping(STEPS_METADATA_ROUTE)
    public void deleteStepMetadataRoute(@NotNull @PathVariable String keyword) {
        validateRequester();
        stepMetadataKeywordDaoJpa.deleteByKeyword(keyword);

    }

    @DeleteMapping(SELECTIONS_METADATA_ROUTE)
    public void deleteSelectionMetadataRoute(@NotNull @PathVariable String keyword) {
        validateRequester();
        selectionMetadataKeywordDaoJpa.deleteByKeyword(keyword);

    }

    @PutMapping(CHOICES_METADATA_ROUTE)
    public ChoiceMetadata updateChoiceMetadataRoute(@NotNull @PathVariable String keyword, @Valid @RequestBody UpdateChoiceMetadataKeywordsParams params) {
        validateRequester();
        return choiceMetadataKeywordDaoJpa.updateByKeyword(keyword, params.getChoiceId()).toPresentationModel();

    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
