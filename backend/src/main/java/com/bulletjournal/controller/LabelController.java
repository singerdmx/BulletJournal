package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateLabelParams;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.UpdateLabelParams;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.repository.LabelDaoJpa;
import com.bulletjournal.repository.SystemDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.User;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class LabelController {

    protected static final String LABELS_ROUTE = "/api/labels";
    protected static final String PROJECT_LABELS_ROUTE = "/api/projects/{projectId}/labels";
    protected static final String LABEL_ROUTE = "/api/labels/{labelId}";
    protected static final String ITEMS_ROUTE = "/api/items";

    @Autowired
    private LabelDaoJpa labelDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserClient userClient;

    @Autowired
    private SystemDaoJpa systemDaoJpa;

    @PostMapping(LABELS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Label createLabel(@Valid @RequestBody CreateLabelParams label) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return labelDaoJpa.create(label.getValue(), username, label.getIcon()).toPresentationModel();
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
    public ResponseEntity<List<Label>> getLabels(@RequestParam(name = "projectId", required = false) Long projectId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        final Set<String> projectLabelValues = new HashSet<>();
        List<Label> labelsForProject = Collections.emptyList();
        if (projectId != null) {
            labelsForProject = this.systemDaoJpa.getProjectLabels(projectId, username);
            if (labelsForProject != null) {
                labelsForProject.forEach(l -> projectLabelValues.add(l.getValue()));
            }
        }
        List<Label> labels = this.labelDaoJpa.getLabels(username).stream().map(label -> label.toPresentationModel())
                .filter(label -> !projectLabelValues.contains(label.getValue())) // label in project take precedence
                .collect(Collectors.toList());
        labels.addAll(labelsForProject);
        labels = new ArrayList<>(new HashSet<>(labels));
        String labelsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, labels);

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(labelsEtag);
        return ResponseEntity.ok().headers(responseHeader).body(labels);
    }

    @GetMapping(PROJECT_LABELS_ROUTE)
    public ResponseEntity<List<Label>> getProjectLabels(@NotNull @PathVariable Long projectId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Label> labelsForProject = this.systemDaoJpa.getProjectLabels(projectId, username);
        return ResponseEntity.ok().body(labelsForProject);
    }

    @DeleteMapping(LABEL_ROUTE)
    public ResponseEntity<?> deleteLabel(@PathVariable Long labelId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.labelDaoJpa.delete(username, labelId);
        return ResponseEntity.ok().build();
    }

    @GetMapping(ITEMS_ROUTE)
    public List<ProjectItems> getItemsByLabels(@Valid @RequestParam List<Long> labels) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        User user = this.userDaoJpa.getByName(username);
        return ProjectItems.addAvatar(this.labelDaoJpa.getItemsByLabels(user.getTimezone(), labels, username),
                this.userClient);
    }

}
