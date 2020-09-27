package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.AddUserGroupParams;
import com.bulletjournal.controller.models.RemoveUserGroupParams;
import com.bulletjournal.controller.models.UpdateGroupParams;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.Informed;
import com.bulletjournal.notifications.InviteToJoinGroupEvent;
import com.bulletjournal.notifications.JoinGroupEvent;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.factory.Etaggable;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


@Repository
public class GroupDaoJpa implements Etaggable {
    private static final Logger LOGGER = LoggerFactory.getLogger(GroupDaoJpa.class);

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private AuthorizationService authorizationService;

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Group create(String name, String owner) {
        User user = this.userDaoJpa.getByName(owner);
        Group group = new Group();
        group.setName(name);
        group.setOwner(owner);
        group.addUser(user);

        if (!this.groupRepository.findByNameAndOwner(name, owner).isEmpty()) {
            throw new ResourceAlreadyExistException("Group with name \"" + name + "\" already exists");
        }
        group = this.groupRepository.save(group);
        UserGroup userGroup = new UserGroup(user, group, true);
        this.userGroupRepository.save(userGroup);
        group.setUsers(ImmutableSet.of(userGroup));
        return group;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> delete(final Long groupId, final String requester) {

        Group group = this.groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " not found"));

        if (group.isDefaultGroup()) {
            throw new UnAuthorizedException("Default Group cannot be deleted");
        }

        this.authorizationService.checkAuthorizedToOperateOnContent(
                group.getOwner(), requester, ContentType.GROUP, Operation.DELETE, groupId, group.getName());

        if (!group.getProjects().isEmpty()) {
            throw new BadRequestException(
                    "Group [" + group.getName() + "] is associated with Projects " +
                            group.getProjects().stream().map(p -> p.getName()).collect(Collectors.toList()) +
                            " and it cannot be deleted");
        }

        List<Event> events = new ArrayList<>();
        for (UserGroup userGroup : group.getUsers()) {
            this.userGroupRepository.delete(userGroup);
            String targetUser = userGroup.getUser().getName();
            if (!Objects.equals(targetUser, requester)) {
                events.add(new Event(targetUser, userGroup.getGroup().getId(), userGroup.getGroup().getName()));
            }
        }

        this.groupRepository.delete(group);
        return events;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Group partialUpdate(String requester, Long groupId, UpdateGroupParams updateGroupParams) {
        Group group = this.groupRepository
                .findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                group.getOwner(), requester, ContentType.GROUP, Operation.UPDATE, groupId);

        if (Objects.equals(group.getName(), updateGroupParams.getName())) {
            return group;
        }

        if (!this.groupRepository.findByNameAndOwner(updateGroupParams.getName(), requester).isEmpty()) {
            throw new ResourceAlreadyExistException("Group with name \"" + updateGroupParams.getName()
                    + "\" already exists");
        }

        DaoHelper.updateIfPresent(
                updateGroupParams.hasName(), updateGroupParams.getName(), (value) -> group.setName(value));

        return this.groupRepository.save(group);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Group getDefaultGroup(String owner) {
        List<Group> groupList = this.groupRepository.findDefaultGroup(owner);
        if (groupList.isEmpty()) {
            throw new ResourceNotFoundException("Default Group for user " + owner + " does not exist");
        }

        if (groupList.size() > 1) {
            throw new IllegalStateException("More than one Default Group for user " + owner + " exist");
        }

        return groupList.get(0);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Group> getProjectItemGroups(String owner) {
        User user = this.userDaoJpa.getByName(owner);
        return user.getGroups()
                .stream()
                .map(userGroup -> userGroup.getGroup())
                .sorted((a, b) -> {
                    if (a.isDefaultGroup() && a.getOwner().equals(owner)) {
                        return -1;
                    }
                    if (b.isDefaultGroup() && b.getOwner().equals(owner)) {
                        return 1;
                    }
                    return Long.compare(a.getId(), b.getId());
                })
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Group> getGroups(String owner) {
        User user = this.userDaoJpa.getByName(owner);
        return user.getGroups()
                .stream()
                .map(userGroup -> userGroup.getGroup())
                .sorted((a, b) -> {
                    if (a.isDefaultGroup() && a.getOwner().equals(owner)) {
                        return -1;
                    }
                    if (b.isDefaultGroup() && b.getOwner().equals(owner)) {
                        return 1;
                    }
                    return Long.compare(a.getId(), b.getId());
                })
                .map(group -> {
                    com.bulletjournal.controller.models.Group g = group.toPresentationModel();
                    g.setUsers(group.getUsers()
                            .stream()
                            .map(u -> new com.bulletjournal.controller.models.UserGroup(
                                    u.getUser().getName(), u.isAccepted()))
                            .collect(Collectors.toList()));
                    return g;
                })

                .collect(Collectors.toList());
    }

    @Deprecated
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public JoinGroupEvent addUserGroups(
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

        return new JoinGroupEvent(events, owner);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Informed> addUserGroup(
            String requester,
            AddUserGroupParams addUserGroupParams) {

        Long groupId = addUserGroupParams.getGroupId();
        Group group = this.groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " not found"));
        if (!group.getUsers().stream().anyMatch(ug -> Objects.equals(ug.getUser().getName(), requester))) {
            throw new UnAuthorizedException("User " + requester + " not in group " + group.getName());
        }
        String username = addUserGroupParams.getUsername();
        if (Objects.equals(username, requester)) {
            LOGGER.warn("Cannot invite yourself");
            return Collections.emptyList();
        }
        User user = this.userDaoJpa.getByName(username);
        UserGroupKey key = new UserGroupKey(user.getId(), groupId);
        Optional<UserGroup> userGroup = this.userGroupRepository.findById(key);
        if (!userGroup.isPresent()) {
            UserGroup ug = new UserGroup(user, group, false);
            this.userGroupRepository.save(ug);
            group.getUsers().add(ug);
            this.groupRepository.save(group);
        }

        List<Informed> informeds = new ArrayList<>();
        informeds.add(new JoinGroupEvent(new Event(username, groupId, group.getName()), requester));
        if (!Objects.equals(requester, group.getOwner())) {
            informeds.add(new InviteToJoinGroupEvent(
                    new Event(group.getOwner(), groupId, group.getName()), requester, username));
        }
        return informeds;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Group getGroup(Long id) {
        Group group = this.groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + id + " not found"));
        return group;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> removeUserGroups(
            String requester,
            List<RemoveUserGroupParams> removeUserGroupsParams) {

        List<Event> events = new ArrayList<>();
        for (RemoveUserGroupParams removeUserGroupParams : removeUserGroupsParams) {
            String username = removeUserGroupParams.getUsername();

            Long groupId = removeUserGroupParams.getGroupId();
            Group group = this.groupRepository.findById(groupId)
                    .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " not found"));

            boolean authorized = Objects.equals(group.getOwner(), requester) && !Objects.equals(username, requester);
            authorized = authorized || (!Objects.equals(group.getOwner(), requester) && Objects.equals(username, requester));

            if (!authorized) {
                throw new UnAuthorizedException("Not authorized");
            }

            User user = this.userDaoJpa.getByName(username);
            UserGroupKey userGroupKey = new UserGroupKey(user.getId(), group.getId());
            UserGroup userGroup = this.userGroupRepository.findById(userGroupKey)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("UserGroupKey not found"));

            this.assignProjectsToOwnerDefaultGroup(username, userGroup);
            this.userGroupRepository.delete(userGroup);

            if (!Objects.equals(requester, username)) { // do not notify on leaving group
                events.add(new Event(username, groupId, group.getName()));
            }
        }
        return events;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void assignProjectsToOwnerDefaultGroup(String username, UserGroup userGroup) {

        Group group = this.getDefaultGroup(username);
        for (Project project : userGroup.getGroup().getProjects()
                .stream().filter(p -> p.getOwner().equals(username)).collect(Collectors.toList())
        ) {
            project.setGroup(group);
            this.projectRepository.save(project);
        }
    }

    @Override
    public Set<String> findAffectedUsernames(Set<String> contentIds, EtagType type) {
        if (EtagType.GROUP.equals(type)) {
            Set<String> users = new HashSet<>();
            List<Long> ids = contentIds.stream().map(Long::parseLong).collect(Collectors.toList());
            List<Group> groups = this.groupRepository.findAllById(ids)
                    .stream().filter(Objects::nonNull).collect(Collectors.toList());
            groups.forEach(group -> group.getUsers().forEach(userGroup -> users.add(userGroup.getUser().getName())));
            return users;
        }

        Preconditions.checkArgument(EtagType.GROUP_DELETE.equals(type));
        return contentIds;
    }

    @Override
    public String getUserEtag(String username) {
        List<com.bulletjournal.controller.models.Group> groupList = this.getGroups(username);
        return EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE,
                groupList);
    }
}
