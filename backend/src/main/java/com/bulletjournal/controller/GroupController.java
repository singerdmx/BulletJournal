package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.repository.GroupDaoJpa;
import com.google.common.collect.ImmutableList;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class GroupController {

    protected static final String GROUPS_ROUTE = "/api/groups";
    protected static final String GROUP_ROUTE = "/api/groups/{groupId}";

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Autowired
    private UserClient userClient;

    @PostMapping(GROUPS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Group createGroup(@Valid @RequestBody CreateGroupParams group) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return groupDaoJpa.create(group.getName(), username).toPresentationModel();
    }

    @DeleteMapping(GROUP_ROUTE)
    public ResponseEntity<?> deleteGroup(@PathVariable Long groupId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.groupDaoJpa.delete(groupId, username);
        return ResponseEntity.ok().build();
    }

    @PatchMapping(GROUP_ROUTE)
    public Group updateGroup(@NotNull @PathVariable Long groupId,
                             @Valid @RequestBody UpdateGroupParams updateGroupParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.groupDaoJpa.partialUpdate(username, groupId, updateGroupParams).toPresentationModel();
    }

    @GetMapping(GROUPS_ROUTE)
    public List<Group> getGroups() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Group> groups = this.groupDaoJpa.getGroups(username);
        addUserToGroup(groups);
        return groups;
    }

    private void addUserToGroup(List<Group> groups) {
        groups.stream().forEach(g -> {
            List<UserGroup> users = g.getUsers().stream()
                    .map(user -> {
                        User u = this.userClient.getUser(user.getName());
                        return new UserGroup(u.getName(), u.getThumbnail(), u.getAvatar(), user.isAccepted());
                    }).collect(Collectors.toList());
            g.setUsers(users);
        });
    }

    @PostMapping("/addUserGroups")
    public List<Group> addUserGroups(AddUserGroupsParams addUserGroupsParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Group> groups = this.groupDaoJpa.addUserGroups(username, addUserGroupsParams.getUserGroups());
        addUserToGroup(groups);
        return groups;
    }

    @PostMapping("/addUserGroup")
    public List<Group> addUserGroups(AddUserGroupParams addUserGroupParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Group> groups = this.groupDaoJpa.addUserGroups(username, ImmutableList.of(addUserGroupParams));
        addUserToGroup(groups);
        return groups;
    }
}