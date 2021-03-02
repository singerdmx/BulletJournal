package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.Projects;
import com.bulletjournal.controller.models.ProjectsWithOwner;
import com.bulletjournal.controller.models.params.CreateProjectParams;
import com.bulletjournal.controller.models.params.UpdateProjectParams;
import com.bulletjournal.controller.models.params.UpdateSharedProjectsOrderParams;
import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.ProjectRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.SampleProjectsCreation;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class ProjectDaoJpa {
    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectDaoJpa.class);
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
    @Autowired
    private ProjectSettingRepository projectSettingRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Projects getProjects(String owner, List<Project> projects) {
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
        Pair<List<ProjectsWithOwner>, List<Project>> sharedProjects = getSharedProjects(userProjects, owner);
        result.setShared(sharedProjects.getLeft());

        if (projects != null) {
            projects.addAll(sharedProjects.getRight());
        }

        return result;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project getProject(Long projectId, String requester) {
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        this.authorizationService.validateRequesterInProjectGroup(requester, project);
        return project;
    }

    private Pair<List<ProjectsWithOwner>, List<Project>> getSharedProjects(
            final UserProjects userProjects, final String owner) {
        // project owner -> project ids
        Map<String, Set<Long>> projectIds = new HashMap<>();
        List<Project> projects = this.getUserProjects(owner);
        projects.forEach(project -> {
            String projectOwner = project.getOwner();
            if (!Objects.equals(owner, projectOwner)) {
                // skip projects owned by me
                projectIds.computeIfAbsent(projectOwner, k -> new HashSet<>()).add(project.getId());
            }
        });

        String sharedProjectRelations = userProjects.getSharedProjects();
        List<String> owners = sharedProjectRelations == null ? new ArrayList<>() :
                Arrays.asList(GSON.fromJson(sharedProjectRelations, String[].class));

        List<ProjectsWithOwner> result = new ArrayList<>();
        for (String projectOwner : owners) {
            Set<Long> projectsByOwner = projectIds.remove(projectOwner);
            addProjectsByOwner(projectOwner, projectsByOwner, result);
        }

        for (Map.Entry<String, Set<Long>> entry : projectIds.entrySet()) {
            String projectOwner = entry.getKey();
            addProjectsByOwner(projectOwner, entry.getValue(), result);
        }

        return Pair.of(result, projects);
    }

    private void addProjectsByOwner(String o, Set<Long> projectsByOwner,
                                    List<ProjectsWithOwner> result) {
        if (projectsByOwner == null) {
            return;
        }

        List<com.bulletjournal.controller.models.Project> l = getOwnerProjects(
                this.userProjectsRepository.findById(o).orElse(new UserProjects()), o, projectsByOwner);
        if (l.isEmpty()) {
            return;
        }

        result.add(new ProjectsWithOwner(new com.bulletjournal.controller.models.User(o), l));
    }

    private List<com.bulletjournal.controller.models.Project> getOwnerProjects(
            UserProjects userProjects, String owner) {
        return getOwnerProjects(userProjects, owner, null);
    }

    private List<com.bulletjournal.controller.models.Project> getOwnerProjects(
            UserProjects userProjects, String owner, Set<Long> projectFilter) {
        List<com.bulletjournal.controller.models.Project> ret = new ArrayList<>();
        List<Project> projects = this.projectRepository.findByOwner(owner);
        if (projectFilter != null) {
            projects = projects.stream().filter(p -> projectFilter.contains(p.getId())).collect(Collectors.toList());
        }
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<Project, Project> createSampleProjects(SampleProjectsCreation sampleProjectsCreation) {
        long groupId = sampleProjectsCreation.getGroup().getId();
        String username = sampleProjectsCreation.getUsername();
        CreateProjectParams sampleTodoProjectParams =
                new CreateProjectParams("TODO List", ProjectType.TODO,
                        "Manage your tasks here",
                        groupId);
        Project todoProject = this.create(sampleTodoProjectParams, sampleProjectsCreation.getUsername(), Collections.emptyList());
        LOGGER.info("Sample todo list project {} created for user {}", todoProject.getId(), username);

        CreateProjectParams sampleBeginnerProjectParams =
                new CreateProjectParams("Beginner's Guide", ProjectType.TODO,
                        "Step by Step Guide to Use BuJo",
                        groupId);
        Project beginnerProject = this.create(sampleBeginnerProjectParams, sampleProjectsCreation.getUsername(), Collections.emptyList());
        LOGGER.info("Sample Beginner's Guide project {} created for user {}", beginnerProject.getId(), username);

        CreateProjectParams sampleNoteProjectParams =
                new CreateProjectParams("Notes", ProjectType.NOTE,
                        "Add your notes here",
                        groupId);
        Project noteProject = this.create(sampleNoteProjectParams, sampleProjectsCreation.getUsername(), Collections.emptyList());
        LOGGER.info("Sample note project {} created for user {}", noteProject.getId(), username);

        CreateProjectParams sampleLedgerProjectParams =
                new CreateProjectParams("Ledger", ProjectType.LEDGER,
                        "Track your transactions here",
                        groupId);
        Project ledgerProject = this.create(sampleLedgerProjectParams, sampleProjectsCreation.getUsername(), Collections.emptyList());
        LOGGER.info("Sample ledger project {} created for user {}", ledgerProject.getId(), username);

        CreateProjectParams sampleBillProjectParams =
                new CreateProjectParams("Bill", ProjectType.LEDGER,
                        null,
                        groupId);
        Project billProject = this.create(sampleBillProjectParams, sampleProjectsCreation.getUsername(), Collections.emptyList());
        LOGGER.info("Sample Bill project {} created for user {}", billProject.getId(), username);

        List<com.bulletjournal.controller.models.Project> projects = new ArrayList<>();
        projects.add(todoProject.toPresentationModel());
        projects.get(0).addSubProject(beginnerProject.toPresentationModel());
        projects.add(noteProject.toPresentationModel());
        projects.add(ledgerProject.toPresentationModel());
        projects.get(2).addSubProject(billProject.toPresentationModel());
        this.updateUserOwnedProjects(username, projects);

        this.projectSettingRepository.save(new ProjectSetting(todoProject, "{\"r\":239,\"g\":239,\"b\":241,\"a\":1}", false));
        this.projectSettingRepository.save(new ProjectSetting(beginnerProject, "{\"r\":236,\"g\":212,\"b\":212,\"a\":1}", false));
        this.projectSettingRepository.save(new ProjectSetting(noteProject, "{\"r\":253,\"g\":242,\"b\":240,\"a\":1}", false));
        this.projectSettingRepository.save(new ProjectSetting(ledgerProject, "{\"r\":254,\"g\":245,\"b\":212,\"a\":1}", false));
        this.projectSettingRepository.save(new ProjectSetting(billProject, "{\"r\":218,\"g\":218,\"b\":252,\"a\":1}", false));
        return Pair.of(beginnerProject, noteProject);
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Project> getUserProjects(String username) {
        List<Project> result = new ArrayList<>();
        User user = this.userDaoJpa.getByName(username);
        for (UserGroup userGroup : user.getGroups()) {
            if (!userGroup.isAccepted()) {
                continue;
            }
            Group group = userGroup.getGroup();
            result.addAll(group.getProjects().stream().filter(p -> !p.isShared()).collect(Collectors.toList()));
        }

        return result;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void setProjectOwner(Long projectId, String owner, String requester) {
        Project project = getProject(projectId, requester);
        this.authorizationService.checkAuthorizedToOperateOnContent(
                project.getOwner(), requester, ContentType.PROJECT, Operation.UPDATE, project.getId());

        this.authorizationService.validateRequesterInProjectGroup(owner, project);
        project.setOwner(owner);
        this.projectRepository.save(project);
    }
}
