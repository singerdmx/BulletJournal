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
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class GroupController {

    protected static final String GROUPS_ROUTE = "/api/groups";
    protected static final String GROUP_ROUTE = "/api/groups/{groupId}";
    protected static final String ADD_USER_GROUPS_ROUTE = "/addUserGroups";
    protected static final String ADD_USER_GROUP_ROUTE = "/addUserGroup";
    protected static final String REMOVE_USER_GROUP_ROUTE = "/removeUserGroup";
    protected static final String REMOVE_USER_GROUPS_ROUTE = "/removeUserGroups";

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
    public List<GroupsWithOwner> getGroups() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Group> groups = this.groupDaoJpa.getGroups(username);
        groups = addUserAvatarToGroups(groups);
        // owner name -> groups (order by owner)
        Map<String, List<Group>> m = new TreeMap<>();
        // group -> self accepted or not
        Map<Group, Boolean> accepts = new HashMap<>();
        for (Group group : groups) {
            m.computeIfAbsent(group.getOwner(), k -> new ArrayList<>()).add(group);
            UserGroup self = group.getUsers().stream()
                    .filter(u -> Objects.equals(username, u.getName())).findFirst().get();
            accepts.put(group, self.isAccepted());
        }
        List<GroupsWithOwner> result = new ArrayList<>();
        result.add(new GroupsWithOwner(username, m.get(username)));
        for (Map.Entry<String, List<Group>> entry : m.entrySet()) {
            if (Objects.equals(entry.getKey(), username)) {
                continue;
            }
            List<Group> l = entry.getValue();
            // sort by group name, but accepted group first
            Collections.sort(l, (a, b) -> {
                if (Objects.equals(accepts.get(a), accepts.get(b))) {
                    return a.getName().compareTo(b.getName());
                }

                return accepts.get(a) ? 1 : -1;
            });
            for (Group group : l) {
                // sort by username
                Collections.sort(group.getUsers(), (a, b) -> {
                    if (Objects.equals(a.isAccepted(), b.isAccepted())) {
                        return a.getName().compareTo(b.getName());
                    }

                    return a.isAccepted() ? 1 : -1;
                });
                // move owner to the first
                UserGroup ownerUserGroup = group.getUsers().stream()
                        .filter(u -> Objects.equals(group.getOwner(), u.getName())).findFirst().get();
                group.getUsers().remove(ownerUserGroup);
                group.getUsers().add(0, ownerUserGroup);
            }
            result.add(new GroupsWithOwner(entry.getKey(), l));
        }
        return result;
    }

    private List<Group> addUserAvatarToGroups(List<Group> groups) {
        groups.stream().forEach(g -> {
            addUserAvatarToGroup(g);
        });
        return groups;
    }

    private Group addUserAvatarToGroup(Group g) {
        List<UserGroup> users = g.getUsers().stream()
                .map(user -> {
                    User u = this.userClient.getUser(user.getName());
                    return new UserGroup(u.getName(), u.getThumbnail(), u.getAvatar(), user.isAccepted());
                }).collect(Collectors.toList());
        g.setUsers(users);
        return g;
    }

    @PostMapping(ADD_USER_GROUPS_ROUTE)
    public List<GroupsWithOwner> addUserGroups(@Valid @RequestBody AddUserGroupsParams addUserGroupsParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.groupDaoJpa.addUserGroups(username, addUserGroupsParams.getUserGroups());
        return getGroups();
    }

    @PostMapping(ADD_USER_GROUP_ROUTE)
    public Group addUserGroup(@Valid @RequestBody AddUserGroupParams addUserGroupParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.groupDaoJpa.addUserGroups(username, ImmutableList.of(addUserGroupParams));
        return addUserAvatarToGroup(this.groupDaoJpa.getGroup(addUserGroupParams.getGroupId()).toVerbosePresentationModel());
    }

    @PostMapping(REMOVE_USER_GROUPS_ROUTE)
    public void removeUserGroups(@Valid @RequestBody RemoveUserGroupsParams removeUserGroupsParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.groupDaoJpa.removeUserGroups(username, removeUserGroupsParams.getUserGroups());
    }

    @PostMapping(REMOVE_USER_GROUP_ROUTE)
    public void removeUserGroup(@Valid @RequestBody RemoveUserGroupParams removeUserGroupParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.groupDaoJpa.removeUserGroups(username, ImmutableList.of(removeUserGroupParams));
    }
}