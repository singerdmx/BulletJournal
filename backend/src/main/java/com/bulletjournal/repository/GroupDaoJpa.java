package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.controller.models.AddUserGroupParams;
import com.bulletjournal.controller.models.RemoveUserGroupParams;
import com.bulletjournal.controller.models.UpdateGroupParams;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.*;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.models.UserGroupKey;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Repository
public class GroupDaoJpa {

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private AuthorizationService authorizationService;

    @Autowired
    private NotificationService notificationService;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Group create(String name, String owner) {
        User user = this.userDaoJpa.getByName(owner);
        Group group = new Group();
        group.setName(name);
        group.setOwner(owner);
        group.addUser(user);

        group = this.groupRepository.save(group);
        this.userGroupRepository.save(new UserGroup(user, group, true));
        return group;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void delete(final Long groupId, final String requester) {

        Group group = this.groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                group.getOwner(), requester, ContentType.GROUP, Operation.DELETE, groupId, group.getName());

        List<Event> events = new ArrayList<>();
        for (UserGroup userGroup : group.getUsers()) {
            this.userGroupRepository.delete(userGroup);
            events.add(new Event(
                    userGroup.getUser().getName(), userGroup.getGroup().getId(), userGroup.getGroup().getName()));
        }

        this.groupRepository.delete(group);

        this.notificationService.inform(
                new DeleteGroupEvent(
                        events.stream().filter(u -> !Objects.equals(u.getTargetUser(), requester))
                                .collect(Collectors.toList()),
                        requester));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Group partialUpdate(String requester, Long groupId, UpdateGroupParams updateGroupParams) {
        Group group = this.groupRepository
                .findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                group.getOwner(), requester, ContentType.GROUP, Operation.UPDATE, groupId);

        DaoHelper.updateIfPresent(
                updateGroupParams.hasName(), updateGroupParams.getName(), (value) -> group.setName(value));

        return this.groupRepository.save(group);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Group> getGroups(String owner) {
        User user = this.userDaoJpa.getByName(owner);
        return user.getGroups()
                .stream()
                .map(userGroup -> {
                    Group group = userGroup.getGroup();
                    com.bulletjournal.controller.models.Group g = group.toPresentationModel();
                    g.setUsers(group.getUsers()
                            .stream()
                            .map(u -> new com.bulletjournal.controller.models.UserGroup(
                                    u.getUser().getName(), u.isAccepted()))
                            .collect(Collectors.toList()));
                    return g;
                })
                .sorted(Comparator.comparingLong(com.bulletjournal.controller.models.Group::getId))
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void addUserGroups(
            String owner,
            List<AddUserGroupParams> addUserGroupsParams) {

        List<Event> events = new ArrayList<>();
        for (AddUserGroupParams addUserGroupParams : addUserGroupsParams) {
            Long groupId = addUserGroupParams.getGroupId();
            Group group = this.groupRepository.findById(groupId)
                    .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " not found"));
            this.authorizationService.checkAuthorizedToOperateOnContent(
                    group.getOwner(), owner, ContentType.GROUP, Operation.UPDATE, groupId);
            String username = addUserGroupParams.getUsername();
            User user = this.userDaoJpa.getByName(username);
            events.add(new Event(username, groupId, group.getName()));
            this.userGroupRepository.save(new UserGroup(user, group, false));
        }

        this.notificationService.inform(new JoinGroupEvent(events, owner));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Group getGroup(Long id) {
        return this.groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + id + " not found"));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void removeUserGroups(
            String owner,
            List<RemoveUserGroupParams> removeUserGroupsParams) {

        List<Event> events = new ArrayList<>();
        for (RemoveUserGroupParams removeUserGroupParams: removeUserGroupsParams) {
            String username = removeUserGroupParams.getUsername();
            if (Objects.equals(username, owner)) {
                throw new BadRequestException("can not remove owner");
            }

            Long groupId = removeUserGroupParams.getGroupId();
            Group group = this.groupRepository.findById(groupId)
                    .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " not found"));
            this.authorizationService.checkAuthorizedToOperateOnContent(
                    group.getOwner(), owner, ContentType.GROUP, Operation.UPDATE, groupId);

            User user = this.userDaoJpa.getByName(username);
            UserGroupKey userGroupKey = new UserGroupKey(user.getId(), group.getId());
            UserGroup userGroup = this.userGroupRepository.findById(userGroupKey)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("UserGroupKey not found"));
            this.userGroupRepository.delete(userGroup);
            events.add(new Event(username, groupId, group.getName()));
        }
        this.notificationService.inform(new RemoveUserFromGroupEvent(events, owner));
    }
}
