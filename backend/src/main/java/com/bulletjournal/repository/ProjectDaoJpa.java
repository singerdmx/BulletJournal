package com.bulletjournal.repository;

import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.UpdateProjectParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

@Repository
public class ProjectDaoJpa {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

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

    public Project partialUpdate(Long projectId, UpdateProjectParams updateProjectParams) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        updateIfPresent(
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

    private <T> void updateIfPresent(Boolean isPresent, T value, Consumer<T> getter) {
        if (isPresent) {
            getter.accept(value);
        }
    }
}
