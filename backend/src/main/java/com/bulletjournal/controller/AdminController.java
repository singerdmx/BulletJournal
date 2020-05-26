package com.bulletjournal.controller;

import com.bulletjournal.authz.Role;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.SetRoleParams;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.controller.models.User;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@RestController
public class AdminController {
    public static final String SET_ROLE_ROUTE = "/api/users/{username}/setRole";
    public static final String USERS_ROUTE = "/api/users";

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserClient userClient;

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

    @GetMapping(USERS_ROUTE)
    public List<User> getUsersByRole(@RequestParam Role role) {
        validateRequester();
        return this.userDaoJpa.getUserRoles(role).stream().map(u -> this.userClient.getUser(u.getName()))
                .collect(Collectors.toList());
    }
}
