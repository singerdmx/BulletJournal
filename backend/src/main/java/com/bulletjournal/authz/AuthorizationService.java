package com.bulletjournal.authz;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.SharedProjectItemDaoJpa;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.google.common.collect.ImmutableSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Component
public class AuthorizationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthorizationService.class);

    public static String SUPER_USER = UUID.randomUUID().toString();

    public static Set<String> ADMINS = ImmutableSet.of(SUPER_USER);

    @Autowired
    @Lazy
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;

    public <T extends ProjectItemModel> void validateRequesterInProjectGroup(String requester, T projectItem) {
        if (this.sharedProjectItemDaoJpa.getSharedProjectItems(requester).stream()
                .anyMatch(item -> Objects.equals(item.getId(), projectItem.getId()) &&
                        Objects.equals(item.getContentType(), projectItem.getContentType()))) {
            return;
        }
        validateRequesterInProjectGroup(requester, projectItem.getProject());
    }

    public <T extends ProjectItemModel> void validateRequesterInProjectGroup(String requester, Project project) {
        if (ADMINS.contains(requester)) {
            return;
        }

        if (!project.getGroup().getAcceptedUsers()
                .stream().anyMatch(u -> Objects.equals(requester, u.getUser().getName()))) {
            throw new UnAuthorizedException("User " + requester + " not in Project "
                    + project.getName());
        }
    }

    public void checkAuthorizedToOperateOnContent(
            String owner, String requester, ContentType contentType,
            Operation operation, Long contentId, Object... other)
            throws UnAuthorizedException {
        switch (contentType) {
            case PROJECT:
                checkAuthorizedToOperateOnProject(owner, requester, operation, contentId);
                break;
            case GROUP:
                checkAuthorizedToOperateOnGroup(owner, requester, operation, contentId);
                break;
            case TASK:
            case NOTE:
            case TRANSACTION:
                checkAuthorizedToOperateOnProjectItem(owner, requester, operation, contentId, other);
                break;
            case CONTENT:
                checkAuthorizedToOperateOnProjectItemContent(owner, requester, operation, contentId, other);
                break;
            case LABEL:
                checkAuthorizedToOperateOnLabel(owner, requester, operation, contentId);
                break;
            default:
        }
    }

    private void checkAuthorizedToOperateOnLabel(
            String owner, String requester, Operation operation, Long contentId) {
        switch (operation) {
            case DELETE:
            case UPDATE:
                if (!Objects.equals(owner, requester)) {
                    throw new UnAuthorizedException("Label " + contentId + " is owner by " +
                            owner + " while request is from " + requester);
                }
                break;
            default:
        }
    }

    private void checkAuthorizedToOperateOnGroup(
            String owner, String requester, Operation operation, Long contentId) {
        switch (operation) {
            case DELETE:
            case UPDATE:
                if (!Objects.equals(owner, requester)) {
                    throw new UnAuthorizedException("Group " + contentId + " is owner by " +
                            owner + " while request is from " + requester);
                }
                break;
            default:
        }
    }

    private void checkAuthorizedToOperateOnProject(
            String owner, String requester, Operation operation, Long contentId) {
        switch (operation) {
            case DELETE:
            case UPDATE:
                if (!Objects.equals(owner, requester)) {
                    throw new UnAuthorizedException("Project " + contentId + " is owner by " +
                            owner + " while request is from " + requester);
                }
                break;
            default:
        }
    }

    private void checkAuthorizedToOperateOnProjectItem(
            String owner, String requester, Operation operation, Long contentId, Object... other) {
        String projectOwner = (String) other[0];
        switch (operation) {
            case DELETE:
            case UPDATE:
                if (!Objects.equals(owner, requester) && !Objects.equals(projectOwner, requester)) {
                    LOGGER.info("Project Item " + contentId + " is owner by " +
                            owner + " and Project is owned by " + projectOwner + " while request is from " + requester);
                }
                break;
        }
    }

    private void checkAuthorizedToOperateOnProjectItemContent(
            String owner, String requester, Operation operation, Long contentId, Object[] other) {
        String projectItemOwner = (String) other[0];
        String projectOwner = (String) other[1];
        ProjectItemModel projectItem = (ProjectItemModel) other[2];
        switch (operation) {
            case DELETE:
            case UPDATE:
                if (this.sharedProjectItemDaoJpa.getSharedProjectItems(requester).contains(projectItem)) {
                    return;
                }
                if (!Objects.equals(owner, requester) && !Objects.equals(projectOwner, requester)
                        && !Objects.equals(projectItemOwner, requester)) {
                    throw new UnAuthorizedException("Project Item " + contentId + " is owner by " +
                            owner + " and Project is owned by " + projectOwner +
                            " and Project Item is owned by " + projectItemOwner +
                            " while request is from " + requester);
                }
                break;
        }
    }
}
