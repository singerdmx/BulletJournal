package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.ProjectRelationsProcessor;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.gson.Gson;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class ProjectDaoJpa {

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

    private static final Gson GSON = new Gson();

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
    public Project getProject(Long projectId) {
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Group " + projectId + " not found"));
        return project;
    }

    private List<ProjectsWithOwner> getSharedProjects(
            UserProjects userProjects, String owner) {
        User user = this.userDaoJpa.getByName(owner);
        // project owner -> project ids
        Map<String, Set<Long>> projectIds = new HashMap<>();
        for (UserGroup userGroup : user.getGroups()) {
            Group group = userGroup.getGroup();
            if (!userGroup.isAccepted()) {
                continue;
            }
            for (Project project : group.getProjects()) {
                String projectOwner = project.getOwner();
                if (Objects.equals(user.getName(), projectOwner)) {
                    // skip projects owned by me
                    continue;
                }
                projectIds.computeIfAbsent(projectOwner, k -> new HashSet<>()).add(project.getId());
            }
        }

        String sharedProjectRelations = userProjects.getSharedProjects();
        List<String> owners = new ArrayList<>();
        if (sharedProjectRelations != null) {
            owners = Arrays.asList(GSON.fromJson(sharedProjectRelations, String[].class));
        }

        List<String> newOwners = new ArrayList<>();
        List<ProjectsWithOwner> result = new ArrayList<>();
        for (String o : owners) {
            Set<Long> projectsByOwner = projectIds.remove(o);
            addProjectsByOwner(newOwners, o, projectsByOwner, result);
        }

        for (Map.Entry<String, Set<Long>> entry : projectIds.entrySet()) {
            addProjectsByOwner(newOwners, entry.getKey(), entry.getValue(), result);
        }

        return result;
    }

    private void addProjectsByOwner(
            List<String> newOwners, String o, Set<Long> projectsByOwner, List<ProjectsWithOwner> result) {
        if (projectsByOwner == null) {
            return;
        }

        newOwners.add(o);
        List<Project> projects = this.projectRepository.findAllById(new ArrayList<>(projectsByOwner));
        String projectRelationsByOwner = this.userProjectsRepository.findById(o).get().getOwnedProjects();
        List<com.bulletjournal.controller.models.Project> l = ProjectRelationsProcessor.processProjectRelations(
                projects.stream().collect(Collectors.toMap(Project::getId, p -> p)),
                projectRelationsByOwner, projectsByOwner);

        if (l.isEmpty()) {
            return;
        }

        result.add(new ProjectsWithOwner(o, l));
    }

    private List<com.bulletjournal.controller.models.Project> getOwnerProjects(
            UserProjects userProjects, String owner) {
        if (userProjects.getOwnedProjects() == null) {
            return Collections.emptyList();
        }
        Map<Long, Project> projects = this.projectRepository.findByOwner(owner)
                .stream().collect(Collectors.toMap(p -> p.getId(), p -> p));
        return ProjectRelationsProcessor.processProjectRelations(
                projects, userProjects.getOwnedProjects(), null);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project create(CreateProjectParams createProjectParams, String owner) {
        Project project = new Project();
        project.setDescription(createProjectParams.getDescription());
        project.setOwner(owner);
        project.setName(createProjectParams.getName());
        project.setType(createProjectParams.getProjectType().getValue());
        project.setGroup(this.groupRepository.findByNameAndOwner(Group.DEFAULT_NAME, owner).get(0));
        this.projectRepository.save(project);
        return project;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project partialUpdate(String requester, Long projectId, UpdateProjectParams updateProjectParams) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                project.getOwner(), requester, ContentType.PROJECT, Operation.UPDATE, projectId);

        DaoHelper.updateIfPresent(
                updateProjectParams.hasName(), updateProjectParams.getName(), (value) -> project.setName(value));

        DaoHelper.updateIfPresent(
                updateProjectParams.hasDescription(),
                updateProjectParams.getDescription(),
                (value) -> project.setDescription(value)
        );

        if (updateProjectParams.hasGroupId() &&
                !Objects.equals(updateProjectParams.getGroupId(), project.getGroup().getId())) {
            Group group = this.groupRepository
                    .findById(updateProjectParams.getGroupId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Group " + updateProjectParams.getGroupId() + " not found"));
            project.setGroup(group);
        }

        return this.projectRepository.save(project);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserOwnedProjects(String user, List<com.bulletjournal.controller.models.Project> projects) {
        Optional<UserProjects> userProjectsOptional = this.userProjectsRepository.findById(user);
        final UserProjects userProjects = userProjectsOptional.isPresent() ?
                userProjectsOptional.get() : new UserProjects();

        userProjects.setOwnedProjects(ProjectRelationsProcessor.processProjectRelations(projects));
        userProjects.setOwner(user);

        this.userProjectsRepository.save(userProjects);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateSharedProjectsOrder(
            String owner, UpdateSharedProjectsOrderParams update) {
        Optional<UserProjects> userProjectsOptional = this.userProjectsRepository.findById(owner);
        final UserProjects userProjects = userProjectsOptional.isPresent() ?
                userProjectsOptional.get() : new UserProjects();

        DaoHelper.updateIfPresent(
                update.hasProjectOwners(), update.getProjectOwners(),
                (value) -> userProjects.setSharedProjects(GSON.toJson(value)));
        userProjects.setOwner(owner);
        this.userProjectsRepository.save(userProjects);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> deleteProject(String owner, Long projectId) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                project.getOwner(), owner, ContentType.PROJECT, Operation.DELETE, projectId);

        UserProjects userProjects = this.userProjectsRepository.findById(owner)
                .orElseThrow(() -> new ResourceNotFoundException("UserProjects by " + owner + " not found"));

        Pair<com.bulletjournal.controller.models.Project, List<com.bulletjournal.controller.models.Project>> result =
                ProjectRelationsProcessor.removeTargetProject(userProjects.getOwnedProjects(), projectId);
        List<com.bulletjournal.controller.models.Project> projectHierarchy = result.getRight();
        com.bulletjournal.controller.models.Project target = result.getLeft();

        // delete project and its subProjects
        List<Project> targetProjects = this.projectRepository
                .findAllById(ProjectRelationsProcessor.findSubProjects(target));
        this.projectRepository.deleteAll(targetProjects);

        // Update project relations
        userProjects.setOwnedProjects(ProjectRelationsProcessor.processProjectRelations(projectHierarchy));
        this.userProjectsRepository.save(userProjects);

        // return generated events
        return generateEvents(owner, targetProjects);
    }

    private List<Event> generateEvents(String owner, List<Project> targetProjects) {
        List<Event> events = new ArrayList<>();
        for (Project p : targetProjects) {
            Long groupId = p.getGroup().getId();
            List<UserGroup> userGroups = this.userGroupRepository.findAllByGroupIdAndAccepted(groupId, true);
            for (UserGroup userGroup : userGroups) {
                // skip send event to self
                if (userGroup.getUser().getName().equals(owner)) continue;
                events.add(new Event(String.valueOf(userGroup.getUser().getName()), p.getId(), p.getName()));
            }
        }
        return events;
    }

}
