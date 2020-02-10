package com.bulletjournal.authz;

import com.bulletjournal.exceptions.UnAuthorizedException;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class AuthorizationService {

    public void checkAuthorizedToOperateOnContent(
            String owner, String requester, ContentType contentType, Operation operation, Long contentId)
            throws UnAuthorizedException {
        switch (contentType) {
            case PROJECT:
                checkAuthorizedToOperateOnProject(owner, requester, operation, contentId);
                break;
            default:
        }
    }

    private void checkAuthorizedToOperateOnProject(
            String owner, String requester, Operation operation, Long contentId) {
        switch (operation) {
            case UPDATE:
                if (!Objects.equals(owner, requester)) {
                    throw new UnAuthorizedException("Project " + contentId + " is owner by " +
                            owner + " while request is from " + requester);
                }
                break;
            default:
        }
    }
}
