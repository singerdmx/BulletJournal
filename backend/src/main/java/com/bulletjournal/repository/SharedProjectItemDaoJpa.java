package com.bulletjournal.repository;

import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.repository.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.function.Consumer;

@Repository
public class SharedProjectItemDaoJpa {

    @Autowired
    private SharedProjectItemRepository sharedProjectItemsRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> List<T> getSharedProjectItems(String user) {
        List<T> result = new ArrayList<>();
        // TODO: implement
        return result;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void save(
            ProjectType projectType, T projectItem, List<String> users) {
        for (String user : new HashSet<>(users)) {
            User targetUser = this.userDaoJpa.getByName(user);
            SharedProjectItem sharedProjectItem = new SharedProjectItem(user);
            switch (projectType) {
                case NOTE:
                    checkSharedProjectExistence(
                            targetUser.hasSharedNotesProject(),
                            projectType,
                            targetUser,
                            (p) -> targetUser.setSharedNotesProject(p));
                    sharedProjectItem.setNote((Note) projectItem);
                    break;
                case TODO:
                    checkSharedProjectExistence(
                            targetUser.hasSharedTasksProject(),
                            projectType,
                            targetUser,
                            (p) -> targetUser.setSharedTasksProject(p));
                    sharedProjectItem.setTask((Task) projectItem);
                    break;
                case LEDGER:
                    checkSharedProjectExistence(
                            targetUser.hasSharedTransactionsProject(),
                            projectType,
                            targetUser,
                            (p) -> targetUser.setSharedTransactionsProject(p));
                    sharedProjectItem.setTransaction((Transaction) projectItem);
                    break;
                default:
                    throw new IllegalArgumentException();
            }
            this.sharedProjectItemsRepository.save(sharedProjectItem);
        }
    }

    private void checkSharedProjectExistence(
            boolean sharedProjectExists, ProjectType projectType, User user, Consumer<Project> userConsumer) {
        if (sharedProjectExists) {
            return;
        }

        Project project = new Project(
                "Shared " + projectType.name(),
                projectType.getValue(),
                this.groupDaoJpa.getDefaultGroup(user.getName()),
                true);
        project.setOwner(user.getName());
        this.projectRepository.save(project);

        userConsumer.accept(project);
        this.userRepository.save(user);
    }
}
