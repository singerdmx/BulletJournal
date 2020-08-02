package com.bulletjournal.controller;

import com.bulletjournal.authz.Role;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.VersionConfig;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.redis.RedisLockedIPRepository;
import com.bulletjournal.redis.RedisLockedUserRepository;
import com.bulletjournal.redis.models.LockedIP;
import com.bulletjournal.redis.models.LockedUser;
import com.bulletjournal.repository.UserDaoJpa;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class AdminController {
    public static final String SET_ROLE_ROUTE = "/api/users/{username}/setRole";
    public static final String USER_ROUTE = "/api/admin/users/{username}";
    public static final String CHANGE_POINTS_ROUTE = "/api/users/{username}/changePoints";
    public static final String SET_POINTS_ROUTE = "/api/users/{username}/setPoints";
    public static final String USERS_ROUTE = "/api/users";
    public static final String LOCKED_USERS_ROUTE = "/api/lockedUsers";
    public static final String UNLOCK_USER_ROUTE = "/api/admin/unlock";
    public static final String LOCK_USER_ROUTE = "/api/admin/lock";
    public static final String VERSION_ROUTE = "/api/version";

    @Autowired
    private VersionConfig versionConfig;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserClient userClient;

    @Autowired
    private RedisLockedUserRepository redisLockedUserRepository;

    @Autowired
    private RedisLockedIPRepository redisLockedIPRepository;

    @PostMapping(SET_ROLE_ROUTE)
    public void setRole(@NotBlank @PathVariable String username, @NotNull @RequestBody SetRoleParams setRoleParams) {
        username = getUsername(username);
        validateRequester();

        this.userDaoJpa.setRole(username, setRoleParams.getRole());
    }

    private String getUsername(String username) {
        User user = this.userClient.getUser(username);
        return user.getName();
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
        return this.userDaoJpa.getUsersByRole(role).stream().map(u -> this.userClient.getUser(u.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping(LOCKED_USERS_ROUTE)
    public LockedUsersAndIPs getLockedUsers() {
        validateRequester();

        LockedUsersAndIPs lockedUserAndIPs = new LockedUsersAndIPs();
        Iterable<LockedIP> ips = redisLockedIPRepository.findAll();
        Iterable<LockedUser> users = redisLockedUserRepository.findAll();
        lockedUserAndIPs.setIps(ips);
        lockedUserAndIPs.setUsers(users);

        return lockedUserAndIPs;
    }

    @PostMapping(UNLOCK_USER_ROUTE)
    public void unlockUser(@NotNull @RequestBody UnlockUserParams unlockUserParams) {
        validateRequester();
        String ip = unlockUserParams.getIp();
        String name = unlockUserParams.getName();

        if (StringUtils.isNotBlank(ip)) {
            redisLockedIPRepository.delete(new LockedIP(ip, null));
        }
        if (StringUtils.isNotBlank(name)) {
            redisLockedUserRepository.delete(new LockedUser(getUsername(name), null));
        }
    }

    @PostMapping(LOCK_USER_ROUTE)
    public void lockUser(@NotNull @RequestBody LockUserParams lockUserParams) {
        validateRequester();
        String ip = lockUserParams.getIp();
        String name = lockUserParams.getName();
        String reason = lockUserParams.getReason();

        if (StringUtils.isNotBlank(ip)) {
            redisLockedIPRepository.save(new LockedIP(ip, reason));
        }
        if (StringUtils.isNotBlank(name)) {
            redisLockedUserRepository.save(new LockedUser(name, reason));
        }
    }

    @PostMapping(CHANGE_POINTS_ROUTE)
    public Myself changePoints(@NotBlank @PathVariable String username,
                             @NotNull @RequestBody ChangePointsParams changePointsParams) {
        username = getUsername(username);
        validateRequester();
        Integer points = changePointsParams.getPoints();
        String description = changePointsParams.getDescription();
        this.userDaoJpa.changeUserPoints(username, points, description);
        return getUser(username);
    }

    @Deprecated
    @PostMapping(SET_POINTS_ROUTE)
    public void setPoints(@NotBlank @PathVariable String username,
                          @NotNull @RequestBody SetPointsParams setPointsParams) {
        username = getUsername(username);
        validateRequester();
        Integer points = setPointsParams.getPoints();
        this.userDaoJpa.setUserPoints(username, points);
    }

    @GetMapping(USER_ROUTE)
    public Myself getUser(@NotBlank @PathVariable String username) {
        validateRequester();
        String timezone = null;
        Before before = null;
        String currency = null;
        String theme = null;
        Integer points = 0;

        com.bulletjournal.repository.models.User user = this.userDaoJpa.getByName(username);
        timezone = user.getTimezone();
        before = user.getReminderBeforeTask();
        currency = user.getCurrency();
        theme = user.getTheme() == null ? Theme.LIGHT.name() : user.getTheme();
        points = user.getPoints();

        User self = userClient.getUser(username);
        return new Myself(self, timezone, before, currency, theme, points);
    }

    @GetMapping(VERSION_ROUTE)
    public String getVersion() {
        return this.versionConfig.getVersion();
    }

}
