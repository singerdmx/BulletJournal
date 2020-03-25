package com.bulletjournal.repository;

import com.bulletjournal.controller.models.UpdateContentParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.SetLabelEvent;
import com.bulletjournal.repository.models.ContentModel;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.bulletjournal.repository.models.UserGroup;
import com.google.common.base.Preconditions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

abstract class ProjectItemDaoJpa<K extends ContentModel> {

    @Autowired
    private LabelDaoJpa labelDaoJpa;

    abstract <T extends ProjectItemModel> JpaRepository<T, Long> getJpaRepository();

    abstract JpaRepository<K, Long> getContentJpaRepository();

    abstract List<K> getContents(Long projectItemId, String requester);

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> ContentModel addContent(
            Long projectItemId, String owner, K content) {
        T projectItem = getProjectItem(projectItemId);
        content.setProjectItem(projectItem);
        content.setOwner(owner);
        this.getContentJpaRepository().save(content);
        return content;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public K getContent(Long contentId) {
        return this.getContentJpaRepository().findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content " + contentId + " not found"));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> K updateContent(
            Long contentId, Long projectItemId, String requester, UpdateContentParams updateContentParams) {
        T projectItem = getProjectItem(projectItemId);
        K content = getContent(contentId);
        Preconditions.checkState(
                Objects.equals(projectItem.getId(), content.getProjectItem().getId()),
                "ProjectItem ID mismatch");
        content.setText(updateContentParams.getText());
        this.getContentJpaRepository().save(content);
        return content;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void deleteContent(Long contentId, Long projectItemId, String requester) {
        T projectItem = getProjectItem(projectItemId);
        K content = getContent(contentId);
        Preconditions.checkState(
                Objects.equals(projectItem.getId(), content.getProjectItem().getId()),
                "ProjectItem ID mismatch");
        this.getContentJpaRepository().delete(content);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> T getProjectItem(Long projectItemId) {
        ProjectItemModel projectItem = this.getJpaRepository().findById(projectItemId)
                .orElseThrow(() -> new ResourceNotFoundException("projectItem " + projectItemId + " not found"));
        return (T) projectItem;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    protected <T extends ProjectItemModel> List<com.bulletjournal.controller.models.Label> getLabelsToProjectItem(T projectItem) {
        return this.labelDaoJpa.getLabels(projectItem.getLabels());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SetLabelEvent setLabels(String requester, Long projectItemId, List<Long> labels) {
        ProjectItemModel projectItem = getProjectItem(projectItemId);
        projectItem.setLabels(labels);
        String contentType = projectItem.getClass().getSimpleName();
        Set<UserGroup> targetUsers = projectItem.getProject().getGroup().getUsers();
        List<Event> events = new ArrayList<>();
        for (UserGroup user : targetUsers) {
            if (!Objects.equals(user.getUser().getName(), requester)) {
                events.add(new Event(user.getUser().getName(), projectItemId, projectItem.getName()));
            }
        }

        this.getJpaRepository().save(projectItem);
        return new SetLabelEvent(events, requester, contentType);
    }
}
