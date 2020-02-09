package com.bulletjournal.repository;

import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
