package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.messaging.MessagingService;
import com.bulletjournal.redis.FirstTimeUserRepository;
import com.bulletjournal.redis.models.FirstTimeUser;
import com.bulletjournal.repository.UserAliasDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Objects;

@RestController
public class UserController {
    public static final String MYSELF_ROUTE = "/api/myself";
    public static final String LOGOUT_MYSELF_ROUTE = "/api/myself/logout";
    public static final String CLEAR_MYSELF_ROUTE = "/api/myself/clear";
    public static final String POINT_ACTIVITY_ROUTE = "/api/pointActivities";
    protected static final String GET_USER_ROUTE = "/api/users/{username}";
    protected static final String CHANGE_ALIAS_ROUTE = "/api/users/{username}/changeAlias";
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    private static final String TRUE = "true";
    public static final String APP_INVITATIONS_ROUTE = "/api/appInvitations";

    @Autowired
    private UserClient userClient;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserAliasDaoJpa userAliasDaoJpa;

    @Autowired
    private FirstTimeUserRepository firstTimeUserRepository;

    @Autowired
    private MessagingService messagingService;

    @GetMapping(GET_USER_ROUTE)
    public User getUser(@NotNull @PathVariable String username) {
        return this.userClient.getUser(username);
    }

    @GetMapping(MYSELF_ROUTE)
    public Myself getMyself(@RequestParam(name = "expand", defaultValue = "false") String expand) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        String timezone = null;
        Before before = null;
        String currency = null;
        String theme = null;
        Integer points = 0;
        User self = userClient.getUser(username);

        if (Objects.equals(expand, TRUE)) {
            com.bulletjournal.repository.models.User user = this.userDaoJpa.getByName(username);
            timezone = user.getTimezone();
            before = user.getReminderBeforeTask();
            currency = user.getCurrency();
            theme = user.getTheme() == null ? Theme.LIGHT.name() : user.getTheme();
            points = user.getPoints();
            this.userClient.updateEmail(user); //TODO: remove this line
        }
        return new Myself(self, timezone, before, currency, theme, points,
                this.firstTimeUserRepository.existsById(username));
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

    @PostMapping(CLEAR_MYSELF_ROUTE)
    public ResponseEntity<?> clear() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        LOGGER.info("Clearing " + username);
        this.firstTimeUserRepository.delete(new FirstTimeUser(username));
        return ResponseEntity.ok().build();
    }

    @PostMapping(CHANGE_ALIAS_ROUTE)
    public ResponseEntity<?> changeAlias(@NotNull @PathVariable String username,
                                         @Valid @RequestBody ChangeAliasParams changeAliasParams) {
        LOGGER.info("Changing " + username + "'s alias to " + changeAliasParams.getAlias());
        String requester = MDC.get(UserClient.USER_NAME_KEY);
        this.userAliasDaoJpa.changeAlias(requester, username, changeAliasParams.getAlias());
        return ResponseEntity.ok().build();
    }

    @GetMapping(POINT_ACTIVITY_ROUTE)
    public ResponseEntity<List<UserPointActivity>> getUserPointActivities() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return ResponseEntity.ok().body(this.userDaoJpa.getPointActivitiesByUsername(username));
    }

    @PostMapping(APP_INVITATIONS_ROUTE)
    public void sendAppInvitations(@Valid @RequestBody AppInvitationParams appInvitationParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        messagingService.sendAppInvitationEmailsToUser(username, appInvitationParams.getEmails());
    }
}
