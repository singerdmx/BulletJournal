package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.notifications.*;
import com.bulletjournal.redis.RedisEtagDaoJpa;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.GroupDaoJpa;
import com.google.common.collect.ImmutableList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.*;

@RestController
public class GroupController {

    protected static final String GROUPS_ROUTE = "/api/groups";
    protected static final String GROUP_ROUTE = "/api/groups/{groupId}";
    protected static final String ADD_USER_GROUPS_ROUTE = "/api/addUserGroups";
    public static final String ADD_USER_GROUP_ROUTE = "/api/addUserGroup";
    protected static final String REMOVE_USER_GROUP_ROUTE = "/api/removeUserGroup";
    protected static final String REMOVE_USER_GROUPS_ROUTE = "/api/removeUserGroups";
    private static final Logger LOGGER = LoggerFactory.getLogger(GroupController.class);
    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Autowired
    private UserClient userClient;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RedisEtagDaoJpa redisEtagDaoJpa;

    @PostMapping(GROUPS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Group createGroup(@Valid @RequestBody CreateGroupParams group) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return getGroup(groupDaoJpa.create(group.getName(), username).getId());
    }

    @DeleteMapping(GROUP_ROUTE)
    public ResponseEntity<?> deleteGroup(@PathVariable Long groupId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = this.groupDaoJpa.delete(groupId, username);
        this.notificationService.inform(new DeleteGroupEvent(events, username));
        return ResponseEntity.ok().build();
    }

    @PatchMapping(GROUP_ROUTE)
    public Group updateGroup(@NotNull @PathVariable Long groupId,
                             @Valid @RequestBody UpdateGroupParams updateGroupParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.groupDaoJpa.partialUpdate(username, groupId, updateGroupParams);
        return getGroup(groupId);
    }

    @GetMapping(GROUP_ROUTE)
    public Group getGroup(@NotNull @PathVariable Long groupId) {
        com.bulletjournal.repository.models.Group g = this.groupDaoJpa.getGroup(groupId);
        Group group = sortGroup(g.toVerbosePresentationModel());
        if (g.isDefaultGroup()) {
            group.setDefault(true);
        }
        return Group.addOwnerAvatar(group, this.userClient);
    }

    @GetMapping(GROUPS_ROUTE)
    public ResponseEntity<List<GroupsWithOwner>> getGroups() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Group> groups = this.groupDaoJpa.getGroups(username);
        Long defaultGroupId = groups.get(0).getId();
        String groupsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, groups);
        // owner name -> groups (order by owner)
        Map<String, List<Group>> m = new TreeMap<>();
        // group -> self accepted or not
        Map<Group, Boolean> accepts = new HashMap<>();
        for (Group group : groups) {
            m.computeIfAbsent(group.getOwner().getName(), k -> new ArrayList<>()).add(group);
            UserGroup self = group.getUsers().stream().filter(u -> Objects.equals(username, u.getName())).findFirst()
                    .get();
            accepts.put(group, self.isAccepted());
        }
        List<GroupsWithOwner> result = new ArrayList<>();
        List<Group> l = sortGroups(accepts, m.get(username));
        // move defaultGroup to first
        Group defaultGroup = l.stream().filter(g -> defaultGroupId.equals(g.getId())).findFirst().get();
        l.remove(defaultGroup);
        l.add(0, defaultGroup);
        defaultGroup.setDefault(true);
        result.add(new GroupsWithOwner(this.userClient.getUser(username), l));
        for (Map.Entry<String, List<Group>> entry : m.entrySet()) {
            if (Objects.equals(entry.getKey(), username)) {
                continue;
            }
            result.add(new GroupsWithOwner(this.userClient.getUser(entry.getKey()),
                    sortGroups(accepts, entry.getValue())));
        }

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(groupsEtag);

        // Store etag to redis
        redisEtagDaoJpa.singleCache(username, EtagType.GROUP, groupsEtag);

        return ResponseEntity.ok().headers(responseHeader).body(GroupsWithOwner.addOwnerAvatar(result, this.userClient));
    }

    private List<Group> sortGroups(Map<Group, Boolean> accepts, List<Group> l) {
        // sort by group name, but accepted group first
        Collections.sort(l, (a, b) -> {
            if (!Objects.equals(accepts.get(a), accepts.get(b))) {
                return accepts.get(a) ? -1 : 1;
            }

            return a.getName().compareTo(b.getName());
        });
        for (Group group : l) {
            sortGroup(group);
        }
        return l;
    }

    private Group sortGroup(Group group) {
        // sort by username
        Collections.sort(group.getUsers(), (a, b) -> {
            if (!Objects.equals(a.isAccepted(), b.isAccepted())) {
                return a.isAccepted() ? -1 : 1;
            }

            return a.getName().compareTo(b.getName());
        });
        // move owner to the first
        UserGroup ownerUserGroup = group.getUsers().stream().filter(u -> Objects.equals(
                group.getOwner().getName(), u.getName()))
                .findFirst().get();
        group.getUsers().remove(ownerUserGroup);
        group.getUsers().add(0, ownerUserGroup);
        return group;
    }

    @Deprecated
    @PostMapping(ADD_USER_GROUPS_ROUTE)
    public ResponseEntity<List<GroupsWithOwner>> addUserGroups(
            @Valid @RequestBody AddUserGroupsParams addUserGroupsParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.notificationService.inform(this.groupDaoJpa.addUserGroups(username, addUserGroupsParams.getUserGroups()));
        return getGroups();
    }

    @PostMapping(ADD_USER_GROUP_ROUTE)
    public Group addUserGroup(@Valid @RequestBody AddUserGroupParams addUserGroupParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        if (Objects.equals(username, addUserGroupParams.getUsername())) {
            throw new BadRequestException("Cannot add yourself to Group");
        }
        List<Informed> informeds = this.groupDaoJpa.addUserGroup(username, addUserGroupParams);
        for (Informed informed : informeds) {
            this.notificationService.inform(informed);
        }
        return getGroup(addUserGroupParams.getGroupId());
    }

    @Deprecated
    @PostMapping(REMOVE_USER_GROUPS_ROUTE)
    public void removeUserGroups(@Valid @RequestBody RemoveUserGroupsParams removeUserGroupsParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = this.groupDaoJpa.removeUserGroups(username, removeUserGroupsParams.getUserGroups());
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveUserFromGroupEvent(events, username));
        }
    }

    @PostMapping(REMOVE_USER_GROUP_ROUTE)
    public Group removeUserGroup(@Valid @RequestBody RemoveUserGroupParams removeUserGroupParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = this.groupDaoJpa.removeUserGroups(username, ImmutableList.of(removeUserGroupParams));
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveUserFromGroupEvent(events, username));
        }
        return getGroup(removeUserGroupParams.getGroupId());
    }
}