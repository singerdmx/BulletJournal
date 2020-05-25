package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.SetRoleParams;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@RestController
public class AdminController {
    public static final String SET_ROLE_ROUTE = "/api/users/{username}/setRole";

    @Autowired
    private UserDaoJpa userDaoJpa;

    @PostMapping(SET_ROLE_ROUTE)
    public void setRole(@NotBlank @PathVariable String username, @NotNull @RequestBody SetRoleParams setRoleParams) {
        validateRequester();

        this.userDaoJpa.setRole(username, setRoleParams.getRole());
    }

    private void validateRequester() {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        if (!this.userDaoJpa.isAdmin(requester)) {
            throw new UnAuthorizedException("User: " + requester + " is not admin");
        }
    }
}
