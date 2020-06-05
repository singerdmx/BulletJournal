package com.bulletjournal.controller;

import com.bulletjournal.authz.Role;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.LockUserParams;
import com.bulletjournal.controller.models.LockedUsersAndIPs;
import com.bulletjournal.controller.models.SetRoleParams;
import com.bulletjournal.controller.models.UnlockUserParams;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.redis.LockedIP;
import com.bulletjournal.redis.LockedUser;
import com.bulletjournal.redis.RedisLockedIPRepository;
import com.bulletjournal.redis.RedisLockedUserRepository;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.controller.models.User;

import org.apache.commons.lang3.StringUtils;
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
    public static final String LOCKED_USERS_ROUTE = "/api/lockedUsers";
    public static final String UNLOCK_USER_ROUTE = "/api/admin/unlock";
    public static final String LOCK_USER_ROUTE = "/api/admin/lock";

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
            redisLockedUserRepository.delete(new LockedUser(name, null));
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
}
