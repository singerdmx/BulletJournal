package com.bulletjournal.controller;

import javax.validation.constraints.NotBlank;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {
    public static final String SET_ADMIN_ROUTE = "/api/users/{username}/setAdmin";

    @Autowired
    private UserDaoJpa userDaoJpa;

    @PostMapping(SET_ADMIN_ROUTE)
    public void setAdmin(@NotBlank @PathVariable String username) {
        validateRequester();

        this.userDaoJpa.setAdmin(username);
        return;
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
