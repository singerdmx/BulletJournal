package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.Projects;
import com.bulletjournal.controller.models.UpdateProjectParams;
import com.bulletjournal.controller.utils.ProjectRelationsProcessor;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Projects getProjects(String owner) {
        Projects result = new Projects();
        UserProjects userProjects = this.userProjectsRepository.findById(owner)
                .orElseThrow(() -> new ResourceNotFoundException("UserProjects " + owner + " not found"));
        Map<Long, Project> projects = this.projectRepository.findByOwner(owner)
                .stream().collect(Collectors.toMap(p -> p.getId(), p -> p));
        result.setOwned(ProjectRelationsProcessor.processProjectRelations(
                projects, userProjects.getOwnedProjects()));

        // projects that are shared with owner
        User user = this.userDaoJpa.getByName(owner);
        for (UserGroup group : user.getGroups()) {
            if (!Objects.equals(owner, group.getGroup().getOwner()) && group.isAccepted()) {
                group.getGroup().getProjects();
            }
        }


        return result;
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
    public void updateUserProjects(String user, List<com.bulletjournal.controller.models.Project> projects) {
        Optional<UserProjects> userProjectsOptional = this.userProjectsRepository.findById(user);
        UserProjects userProjects = new UserProjects();
        if (userProjectsOptional.isPresent()) {
            userProjects = userProjectsOptional.get();
        }

        userProjects.setOwnedProjects(ProjectRelationsProcessor.processProjectRelations(projects));
        userProjects.setOwner(user);

        this.userProjectsRepository.save(userProjects);
    }
}
