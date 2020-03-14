package com.bulletjournal.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Label;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.google.common.collect.Iterables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

abstract class ProjectItemDaoJpa {

    @Autowired
    private LabelRepository labelRepository;

    abstract <T extends ProjectItemModel> JpaRepository<T, Long> getJpaRepository();

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ProjectItemModel getProjectItem(Long projectItemId) {
        ProjectItemModel projectItem = this.getJpaRepository().findById(projectItemId)
                .orElseThrow(() -> new ResourceNotFoundException("projectItem " + projectItemId + " not found"));
        return projectItem;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    protected <T extends ProjectItemModel> List<com.bulletjournal.controller.models.Label> getLabelsToProjectItem(T projectItem) {
        Long[] labels = projectItem.getLabels();
        List<com.bulletjournal.controller.models.Label> labelsForPresentation = new ArrayList<>();
        if (labels != null && labels.length > 0) {
            labelsForPresentation = this.labelRepository.findAllById(Arrays.asList(labels)).stream()
                    .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                    .map(Label::toPresentationModel)
                    .collect(Collectors.toList());
        }
        return labelsForPresentation;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void setLabels(Long projectItemId, List<Long> labels) {
        ProjectItemModel projectItem = getProjectItem(projectItemId);
        projectItem.setLabels(Iterables.toArray(labels, Long.class));
        this.getJpaRepository().save(projectItem);
    }
}
