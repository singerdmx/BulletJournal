package com.bulletjournal.authz;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.exceptions.UnAuthorizedException;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class AuthorizationService {

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
                    throw new UnAuthorizedException("Project Item " + contentId + " is owner by " +
                            owner + " and Project is owned by " + projectOwner + " while request is from " + requester);
                }
                break;
        }
    }
}
