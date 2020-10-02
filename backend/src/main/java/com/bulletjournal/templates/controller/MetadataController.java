package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.ChoiceMetadata;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MetadataController {
    @Autowired
    private UserDaoJpa userDaoJpa;

    public static final String CHOICE_METADATA_ROUTE = "/api/choiceMetadata";

    @GetMapping(CHOICE_METADATA_ROUTE)
    public List<ChoiceMetadata> geyChoiceMetadata() {
        validateRequester();
        return null;
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
