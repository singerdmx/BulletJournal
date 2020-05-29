package com.bulletjournal.controller;

import com.bulletjournal.authz.Role;
import com.bulletjournal.clients.UserClient;
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
    public static final String UNBLOCK_USER_ROUTE = "/api/admin/unlock";

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

    @PostMapping(UNBLOCK_USER_ROUTE)
    public void unblockUser(@NotNull @RequestBody UnlockUserParams unlockUserParams) {
        validateRequester();
        String ip = unlockUserParams.getIp();
        String name = unlockUserParams.getName();

        if (ip != null) {
            redisLockedIPRepository.delete(new LockedIP(ip, null));
        }
        if (name != null) {
            redisLockedUserRepository.delete(new LockedUser(name, null));
        }
    }
}
