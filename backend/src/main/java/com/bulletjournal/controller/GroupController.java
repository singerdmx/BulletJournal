package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateGroupParams;
import com.bulletjournal.controller.models.Group;
import com.bulletjournal.controller.models.UpdateGroupParams;
import com.bulletjournal.repository.GroupDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class GroupController {

    protected static final String GROUPS_ROUTE = "/api/groups";
    protected static final String GROUP_ROUTE = "/api/groups/{groupId}";

    @Autowired
    private GroupDaoJpa groupDaoJpa;

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
        return this.groupDaoJpa.getGroups(username);
    }

}