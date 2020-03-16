package com.bulletjournal.repository;

import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.ProjectItemModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

abstract class ProjectItemDaoJpa {

    @Autowired
    private LabelDaoJpa labelDaoJpa;

    @Autowired
    private ProjectRepository projectRepository;

    abstract <T extends ProjectItemModel> JpaRepository<T, Long> getJpaRepository();

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ProjectItemModel getProjectItem(Long projectItemId) {
        ProjectItemModel projectItem = this.getJpaRepository().findById(projectItemId)
                .orElseThrow(() -> new ResourceNotFoundException("projectItem " + projectItemId + " not found"));
        return projectItem;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    protected <T extends ProjectItemModel> List<com.bulletjournal.controller.models.Label> getLabelsToProjectItem(T projectItem) {
        return this.labelDaoJpa.getLabels(projectItem.getLabels());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void setLabels(Long projectItemId, List<Long> labels) {
        ProjectItemModel projectItem = getProjectItem(projectItemId);
        projectItem.setLabels(labels);
        this.getJpaRepository().save(projectItem);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void move(Long projectItemId, Long targetProject) {
        Project project = this.projectRepository.findById(targetProject)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + targetProject + " not found"));

        ProjectItemModel projectItem = getProjectItem(projectItemId);
        if (!Objects.equals(projectItem.getProject().getType(), project.getType())) {
            throw new BadRequestException("Cannot move to Project Type " + project.getType());
        }

        projectItem.setProject(project);
        this.getJpaRepository().save(projectItem);
    }
}
