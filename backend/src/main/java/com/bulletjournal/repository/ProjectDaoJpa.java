package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.ContentType;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.UpdateProjectParams;
import com.bulletjournal.controller.utils.ProjectRelationsProcessor;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserProjects;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class ProjectDaoJpa {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProjectsRepository userProjectsRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private AuthorizationService authorizationService;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Project> getProjects(String owner) {
        UserProjects userProjects = this.userProjectsRepository.findById(owner)
                .orElseThrow(() -> new ResourceNotFoundException("UserProjects " + owner + " not found"));
        Map<Long, Project> projects = this.projectRepository.findByOwner(owner)
                .stream().collect(Collectors.toMap(p -> p.getId(), p -> p));
        return ProjectRelationsProcessor.processProjectRelations(
                projects, userProjects.getProjects());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project create(CreateProjectParams createProjectParams, String owner) {
        List<User> userList = this.userRepository.findByName(owner);
        if (userList.isEmpty()) {
            this.userDaoJpa.create(owner);
        }

        Project project = new Project();
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
    public void updateUserProjects(String user, List<com.bulletjournal.controller.models.Project> projects) {
        UserProjects userProjects = new UserProjects();
        userProjects.setProjects(ProjectRelationsProcessor.processProjectRelations(projects));
        userProjects.setName(user);
        this.userProjectsRepository.save(userProjects);
    }
}
