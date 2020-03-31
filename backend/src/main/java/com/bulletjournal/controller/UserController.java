package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.repository.UserDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@RestController
public class UserController {
    public static final String MYSELF_ROUTE = "/api/myself";
    public static final String LOGOUT_MYSELF_ROUTE = "/api/myself/logout";
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    private static final String TRUE = "true";

    @Autowired
    private UserClient userClient;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @GetMapping("/api/users/{username}")
    public User getUser(@NotNull @PathVariable String username) {
        return userClient.getUser(username);
    }

    @GetMapping(MYSELF_ROUTE)
    public Myself getMyself(@RequestParam(name = "expand", defaultValue = "false") String expand) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        String timezone = null;
        Before before = null;
        String currency = null;
        String theme = null;
        if (Objects.equals(expand, TRUE)) {
            com.bulletjournal.repository.models.User user =
                    this.userDaoJpa.getByName(username);
            timezone = user.getTimezone();
            before = user.getReminderBeforeTask();
            currency = user.getCurrency();
            theme = user.getTheme() == null ? Theme.LIGHT.name() : user.getTheme();
        }
        User self = userClient.getUser(username);
        return new Myself(self, timezone, before, currency, theme);
    }

    @PatchMapping(MYSELF_ROUTE)
    public Myself updateMyself(@NotNull @Valid @RequestBody UpdateMyselfParams updateMyselfParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.userDaoJpa.updateMyself(username, updateMyselfParams);
        return getMyself(TRUE);
    }

    @PostMapping(LOGOUT_MYSELF_ROUTE)
    public ResponseEntity<?> logout() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        LOGGER.info("Logging out " + username);
        this.userClient.logout(username);
        LOGGER.info(username + " is logged out, redirecting");
        return ResponseEntity.ok().build();
    }
}
