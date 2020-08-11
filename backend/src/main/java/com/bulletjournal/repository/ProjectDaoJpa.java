package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.ProjectRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class ProjectDaoJpa {

    private static final Gson GSON = new Gson();
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserProjectsRepository userProjectsRepository;
    @Autowired
    private UserDaoJpa userDaoJpa;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private UserGroupRepository userGroupRepository;
    @Autowired
    private ProjectNotesRepository projectNotesRepository;
    @Autowired
    private ProjectTasksRepository projectTasksRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Projects getProjects(String owner) {
        Projects result = new Projects();
        Optional<UserProjects> userProjectsOptional = this.userProjectsRepository.findById(owner);
        UserProjects userProjects;
        if (userProjectsOptional.isPresent()) {
            userProjects = userProjectsOptional.get();
        } else {
            userProjects = new UserProjects(owner);
            this.userProjectsRepository.save(userProjects);
        }

        result.setOwned(getOwnerProjects(userProjects, owner));

        // projects that are shared with owner
        result.setShared(getSharedProjects(userProjects, owner));

        return result;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Set<Long> getProjectIdsByOwners(Set<String> owners) {
        Set<Long> results = new HashSet<>();
        List<UserProjects> userProjectsList = this.userProjectsRepository.findAllById(owners);
        userProjectsList.forEach(userProjects -> {
            Set<Long> ids = HierarchyProcessor.findAllIds(userProjects.getOwnedProjects(), null).getRight();
            results.addAll(ids);
        });
        return results;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project getProject(Long projectId, String requester) {
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        this.authorizationService.validateRequesterInProjectGroup(requester, project);
        return project;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project getProject(Long projectId) {
        return this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
    }

    private List<ProjectsWithOwner> getSharedProjects(UserProjects userProjects, String owner) {
        User user = this.userDaoJpa.getByName(owner);
        // project owner -> project ids
        Map<String, Set<Long>> projectIds = new HashMap<>();
        for (UserGroup userGroup : user.getGroups()) {
            Group group = userGroup.getGroup();
            if (!userGroup.isAccepted()) {
                continue;
            }
            for (Project project : group.getProjects()) {
                if (project.isShared()) {
                    // skip shared projects
                    continue;
                }
                String projectOwner = project.getOwner();
                if (Objects.equals(user.getName(), projectOwner)) {
                    // skip projects owned by me
                    continue;
                }
                projectIds.computeIfAbsent(projectOwner, k -> new HashSet<>()).add(project.getId());
            }
        }

        ProjectsWithOwner sharedItems = getSharedItems(user);
        String sharedProjectRelations = userProjects.getSharedProjects();
        List<String> owners = new ArrayList<>();
        if (sharedProjectRelations != null) {
            owners = Arrays.asList(GSON.fromJson(sharedProjectRelations, String[].class));
        }

        List<String> newOwners = new ArrayList<>();
        List<ProjectsWithOwner> result = new ArrayList<>();
        for (String projectOwner : owners) {
            Set<Long> projectsByOwner = projectIds.remove(projectOwner);
            if (Objects.equals(owner, projectOwner) && sharedItems != null) {
                result.add(sharedItems);
            } else {
                addProjectsByOwner(newOwners, projectOwner, projectsByOwner, result);
            }
        }

        for (Map.Entry<String, Set<Long>> entry : projectIds.entrySet()) {
            String projectOwner = entry.getKey();
            addProjectsByOwner(newOwners, projectOwner, entry.getValue(), result);
        }

        if (sharedItems != null && !result.contains(sharedItems)) {
            result.add(0, sharedItems);
        }
        return result;
    }

    private ProjectsWithOwner getSharedItems(User user) {
        List<Project> projects = new ArrayList<>();
        if (user.hasSharedNotesProject()) {
            projects.add(user.getSharedNotesProject());
        }
        if (user.hasSharedTasksProject()) {
            projects.add(user.getSharedTasksProject());
        }
        if (user.hasSharedTransactionsProject()) {
            projects.add(user.getSharedTransactionsProject());
        }

        if (projects.isEmpty()) {
            return null;
        }

        ProjectsWithOwner projectsWithOwner = new ProjectsWithOwner(
                new com.bulletjournal.controller.models.User(user.getName()),
                projects.stream().map(p -> p.toPresentationModel()).collect(Collectors.toList()));
        return projectsWithOwner;
    }

    private void addProjectsByOwner(List<String> newOwners, String o, Set<Long> projectsByOwner,
                                    List<ProjectsWithOwner> result) {
        if (projectsByOwner == null) {
            return;
        }

        newOwners.add(o);
        List<Project> projects = this.projectRepository.findByOwner(o);
        String projectRelationsByOwner = this.userProjectsRepository.findById(o).get().getOwnedProjects();
        List<com.bulletjournal.controller.models.Project> l = ProjectRelationsProcessor.processRelations(
                projects.stream().collect(Collectors.toMap(Project::getId, p -> p)), projectRelationsByOwner,
                projectsByOwner);

        if (l.isEmpty()) {
            return;
        }

        result.add(new ProjectsWithOwner(new com.bulletjournal.controller.models.User(o), l));
    }

    private List<com.bulletjournal.controller.models.Project> getOwnerProjects(UserProjects userProjects,
                                                                               String owner) {
        List<com.bulletjournal.controller.models.Project> ret = new ArrayList<>();
        List<Project> projects = this.projectRepository.findByOwner(owner);
        if (userProjects.getOwnedProjects() != null) {
            Set<Long> existingIds = projects.stream().map(p -> p.getId()).collect(Collectors.toSet());
            // left is real hierarchy but missing orphaned ones, right is processed ones
            Pair<List<HierarchyItem>, Set<Long>> hierarchy =
                    HierarchyProcessor.findAllIds(userProjects.getOwnedProjects(), existingIds);

            List<HierarchyItem> keptHierarchy = hierarchy.getLeft();
            Set<Long> processedIds = hierarchy.getRight();

            // add processed ones
            final Map<Long, Project> projectMap = projects.stream().filter(p -> processedIds.contains(p.getId()))
                    .collect(Collectors.toMap(p -> p.getId(), p -> p));

            ret.addAll(ProjectRelationsProcessor.processRelations(
                    projectMap, keptHierarchy, null));

            // add orphaned ones(not processed means orphaned)
            projects = projects.stream().filter(p -> !processedIds.contains(p.getId())).collect(Collectors.toList());
        }

        ret.addAll(projects.stream().sorted(Comparator.comparingLong(Project::getId))
                .map(Project::toPresentationModel).collect(Collectors.toList()));
        return ret;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project create(CreateProjectParams createProjectParams, String owner, List<Event> events) {
        String name = createProjectParams.getName();
        if (!this.projectRepository.findByNameAndOwner(name, owner).isEmpty()) {
            throw new ResourceAlreadyExistException("BuJo with name \"" + name + "\" already exists");
        }
        Long groupId = createProjectParams.getGroupId();
        Project project = new Project();
        if (StringUtils.isNotBlank(createProjectParams.getDescription())) {
            project.setDescription(createProjectParams.getDescription());
        }
        project.setOwner(owner);
        project.setName(name);
        project.setType(createProjectParams.getProjectType().getValue());
        Group group = this.groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + groupId + " cannot be found"));
        project.setGroup(group);
        project = this.projectRepository.save(project);
        events.addAll(generateEvents(group, owner, project));
        return project;
    }

    private List<Event> generateEvents(Group group, String requester, Project project) {
        List<Event> events = new ArrayList<>();
        for (UserGroup userGroup : group.getAcceptedUsers()) {
            String targetUser = userGroup.getUser().getName();
            if (targetUser.equals(requester)) {
                continue;
            }
            Event event = new Event(targetUser, project.getId(), project.getName());
            events.add(event);
        }
        return events;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project partialUpdate(String requester, Long projectId, UpdateProjectParams updateProjectParams,
                                 List<Event> joined, List<Event> removed) {
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("BuJo " + projectId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(project.getOwner(), requester, ContentType.PROJECT,
                Operation.UPDATE, projectId);

        if (updateProjectParams.hasName()) {
            String name = updateProjectParams.getName();
            if (!Objects.equals(name, project.getName()) &&
                    !this.projectRepository.findByNameAndOwner(name, project.getOwner()).isEmpty()) {
                throw new ResourceAlreadyExistException("BuJo with name \"" + name + "\" already exists");
            }
            project.setName(name);
        }

        DaoHelper.updateIfPresent(updateProjectParams.hasDescription(), updateProjectParams.getDescription(),
                (value) -> project.setDescription(value));

        Group oldGroup = project.getGroup();
        if (updateProjectParams.hasGroupId() && !Objects.equals(updateProjectParams.getGroupId(), oldGroup.getId())) {
            Group group = this.groupRepository.findById(updateProjectParams.getGroupId()).orElseThrow(
                    () -> new ResourceNotFoundException("Group " + updateProjectParams.getGroupId() + " not found"));
            project.setGroup(group);

            Set<String> oldUsers = oldGroup.getAcceptedUsers().stream().map(u -> u.getUser().getName())
                    .collect(Collectors.toSet());
            Set<String> newUsers = group.getAcceptedUsers().stream().map(u -> u.getUser().getName())
                    .collect(Collectors.toSet());

            generateEvents(joined, removed, project, oldUsers, newUsers);

        }

        return this.projectRepository.save(project);
    }

    private void generateEvents(List<Event> joined, List<Event> removed, Project project, Set<String> oldUsers,
                                Set<String> newUsers) {
        Set<String> overlap = new HashSet<>(newUsers);
        overlap.retainAll(oldUsers);
        for (String user : oldUsers) {
            if (!overlap.contains(user)) {
                removed.add(new Event(user, project.getId(), project.getName()));
            }
        }
        for (String user : newUsers) {
            if (!overlap.contains(user)) {
                joined.add(new Event(user, project.getId(), project.getName()));
            }
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserOwnedProjects(String user, List<com.bulletjournal.controller.models.Project> projects) {
        Optional<UserProjects> userProjectsOptional = this.userProjectsRepository.findById(user);
        final UserProjects userProjects = userProjectsOptional.isPresent() ? userProjectsOptional.get()
                : new UserProjects();

        userProjects.setOwnedProjects(ProjectRelationsProcessor.processRelations(projects));
        userProjects.setOwner(user);

        this.userProjectsRepository.save(userProjects);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateSharedProjectsOrder(String owner, UpdateSharedProjectsOrderParams update) {
        Optional<UserProjects> userProjectsOptional = this.userProjectsRepository.findById(owner);
        final UserProjects userProjects = userProjectsOptional.isPresent() ? userProjectsOptional.get()
                : new UserProjects();

        DaoHelper.updateIfPresent(update.hasProjectOwners(), update.getProjectOwners(),
                (value) -> userProjects.setSharedProjects(GSON.toJson(value)));
        userProjects.setOwner(owner);
        this.userProjectsRepository.save(userProjects);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<List<Event>, Project> deleteProject(String requester, Long projectId) {
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(project.getOwner(), requester, ContentType.PROJECT,
                Operation.DELETE, projectId);

        this.projectRepository.delete(project);

        switch (ProjectType.getType(project.getType())) {
            case TODO:
                if (this.projectTasksRepository.existsById(projectId)) {
                    this.projectTasksRepository.deleteById(projectId);
                }
                break;
            case NOTE:
                if (this.projectNotesRepository.existsById(projectId)) {
                    this.projectNotesRepository.deleteById(projectId);
                }
                break;
            default:
        }

        // return generated events
        return Pair.of(generateEvents(requester, ImmutableList.of(project)), project);
    }

    private List<Event> generateEvents(String owner, List<Project> targetProjects) {
        List<Event> events = new ArrayList<>();
        for (Project p : targetProjects) {
            Long groupId = p.getGroup().getId();
            List<UserGroup> userGroups = this.userGroupRepository.findAllByGroupIdAndAccepted(groupId, true);
            for (UserGroup userGroup : userGroups) {
                // skip send event to self
                String username = userGroup.getUser().getName();
                if (username.equals(owner)) {
                    continue;
                }
                events.add(new Event(username, p.getId(), p.getName()));
            }
        }
        return events;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project getSharedProject(ContentType contentType, String owner) {
        ProjectType projectType = ProjectType.fromContentType(contentType);
        List<Project> projects = this.projectRepository.findByOwnerAndSharedTrue(owner);
        return projects.stream().filter(p -> ProjectType.getType(p.getType()).equals(projectType))
                .findAny().orElse(null);
    }
}
