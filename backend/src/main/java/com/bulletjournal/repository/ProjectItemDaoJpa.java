package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.config.ContentRevisionConfig;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.Revision;
import com.bulletjournal.controller.models.ShareProjectItemParams;
import com.bulletjournal.controller.models.UpdateContentParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.SetLabelEvent;
import com.bulletjournal.notifications.ShareProjectItemEvent;
import com.bulletjournal.repository.models.ContentModel;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.util.ContentDiffTool;
import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

abstract class ProjectItemDaoJpa<K extends ContentModel> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectItemDaoJpa.class);
    @Autowired
    private LabelDaoJpa labelDaoJpa;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private GroupDaoJpa groupDaoJpa;
    @Autowired
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;
    @Autowired
    private PublicProjectItemDaoJpa publicProjectItemDaoJpa;
    @Autowired
    private ContentRevisionConfig revisionConfig;
    @Autowired
    private ContentDiffTool contentDiffTool;

    abstract <T extends ProjectItemModel> JpaRepository<T, Long> getJpaRepository();

    abstract JpaRepository<K, Long> getContentJpaRepository();

    abstract List<K> getContents(Long projectItemId, String requester);

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> String generatePublicItemLink(
            Long projectItemId, String requester, Long ttl) {
        T projectItem = getProjectItem(projectItemId, requester);
        return this.publicProjectItemDaoJpa.generatePublicItemLink(projectItem, requester, ttl);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> ShareProjectItemEvent shareProjectItem(
            Long projectItemId, ShareProjectItemParams shareProjectItemParams, String requester) {
        T projectItem = getProjectItem(projectItemId, requester);
        List<String> users = new ArrayList<>();
        if (StringUtils.isNotBlank(shareProjectItemParams.getTargetUser())) {
            users.add(shareProjectItemParams.getTargetUser());
        }

        if (shareProjectItemParams.getTargetGroup() != null) {
            Group group = this.groupDaoJpa.getGroup(shareProjectItemParams.getTargetGroup());
            for (UserGroup userGroup : group.getUsers()) {
                if (!userGroup.isAccepted()) {
                    continue;
                }

                users.add(userGroup.getUser().getName());
            }
        }

        ProjectType projectType = ProjectType.getType(projectItem.getProject().getType());
        return this.sharedProjectItemDaoJpa.save(projectType, projectItem, users, requester);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> ContentModel addContent(
            Long projectItemId, String owner, K content) {
        T projectItem = getProjectItem(projectItemId, owner);
        content.setProjectItem(projectItem);
        content.setOwner(owner);
        this.getContentJpaRepository().save(content);
        return content;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public K getContent(Long contentId, String requester) {
        K content = this.getContentJpaRepository().findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content " + contentId + " not found"));
        this.authorizationService.validateRequesterInProjectGroup(requester, content.getProjectItem());
        return content;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> K updateContent(
            Long contentId, Long projectItemId, String requester, UpdateContentParams updateContentParams) {
        T projectItem = getProjectItem(projectItemId, requester);
        K content = getContent(contentId, requester);
        Preconditions.checkState(
                Objects.equals(projectItem.getId(), content.getProjectItem().getId()),
                "ProjectItem ID mismatch");
        this.authorizationService.checkAuthorizedToOperateOnContent(
                content.getOwner(), requester, ContentType.CONTENT, Operation.UPDATE, content.getId(),
                projectItem.getOwner(), projectItem.getProject().getOwner(), projectItem);
        updateRevision(content, updateContentParams.getText(), requester);
        content.setText(updateContentParams.getText());
        this.getContentJpaRepository().save(content);
        return content;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void deleteContent(Long contentId, Long projectItemId, String requester) {
        T projectItem = getProjectItem(projectItemId, requester);
        K content = getContent(contentId, requester);
        Preconditions.checkState(
                Objects.equals(projectItem.getId(), content.getProjectItem().getId()),
                "ProjectItem ID mismatch");
        this.authorizationService.checkAuthorizedToOperateOnContent(
                content.getOwner(), requester, ContentType.CONTENT, Operation.DELETE, content.getId(),
                projectItem.getOwner(), projectItem.getProject().getOwner(), projectItem);
        this.getContentJpaRepository().delete(content);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> T getProjectItem(Long projectItemId, String requester) {
        ProjectItemModel projectItem = this.getJpaRepository().findById(projectItemId)
                .orElseThrow(() -> new ResourceNotFoundException("projectItem " + projectItemId + " not found"));
        this.authorizationService.validateRequesterInProjectGroup(requester, projectItem);
        return (T) projectItem;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    protected <T extends ProjectItemModel> List<com.bulletjournal.controller.models.Label> getLabelsToProjectItem(T projectItem) {
        return this.labelDaoJpa.getLabels(projectItem.getLabels());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SetLabelEvent setLabels(String requester, Long projectItemId, List<Long> labels) {
        ProjectItemModel projectItem = getProjectItem(projectItemId, requester);
        projectItem.setLabels(labels);
        Set<UserGroup> targetUsers = projectItem.getProject().getGroup().getUsers();
        List<Event> events = new ArrayList<>();
        for (UserGroup user : targetUsers) {
            if (!Objects.equals(user.getUser().getName(), requester)) {
                events.add(new Event(user.getUser().getName(), projectItemId, projectItem.getName()));
            }
        }

        this.getJpaRepository().save(projectItem);
        return new SetLabelEvent(events, requester, projectItem.getContentType());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> String getContentRevision(
        String requester, Long projectItemId, Long contentId, Long revisionId) {
        T projectItem = getProjectItem(projectItemId, requester);
        K content = getContent(contentId, requester);
        Preconditions.checkState(
            Objects.equals(projectItem.getId(), content.getProjectItem().getId()),
            "ProjectItem ID mismatch");
        Gson gson = new GsonBuilder().create();
        Revision[] revisions = gson.fromJson(content.getRevisions(), Revision[].class);
        Preconditions.checkNotNull(
            revisionId,
            "Revisions for Content: {} is null", contentId);
        boolean hasRevisionId = false;
        for (Revision revision : revisions) {
            if (revision.getId().equals(revisionId)) {
                hasRevisionId = true;
                break;
            }
        }
        Preconditions.checkState(
            hasRevisionId,
            "Invalid revisionId: {} for content: {}", revisionId, contentId);
        if (revisionId.equals(revisions[revisions.length - 1].getId())) {
            return content.getText();
        } else {
            String ret = content.getBaseText();
            for (Revision revision : revisions) {
                ret = contentDiffTool.applyDiff(ret, revision.getDiff());
                if (revision.getId().equals(revisionId)) {
                    return ret;
                }
            }
        }
        return null;
    }

    private void updateRevision(K content, String newText, String requester) {
        Gson gson = new GsonBuilder().create();
        LinkedList<Revision> revisionList = gson.fromJson(content.getRevisions(), LinkedList.class);
        if (revisionList == null) {
            revisionList = new LinkedList<>();
        }
        int maxRevisionNumber = revisionConfig.getMaxRevisionNumber();
        long nextRevisionId;
        if (revisionList.isEmpty()) {
            content.setBaseText(content.getText());
            nextRevisionId = 1;
        } else if (revisionList.size() == maxRevisionNumber) {
            String oldBaseText = content.getBaseText();
            String diffToMerge = revisionList.pollFirst().getDiff();
            content.setBaseText(contentDiffTool.applyDiff(oldBaseText, diffToMerge));
            nextRevisionId = revisionList.getLast().getId() + 1;
        } else {
            nextRevisionId = revisionList.getLast().getId() + 1;
        }
        String diff = contentDiffTool.computeDiff(content.getText(), newText);
        Revision newRevision = new Revision(nextRevisionId, diff, Instant.now().toEpochMilli(), requester);
        revisionList.offerLast(newRevision);
        content.setRevisions(gson.toJson(revisionList));
    }
}
