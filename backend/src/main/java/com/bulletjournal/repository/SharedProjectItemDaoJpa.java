package com.bulletjournal.repository;

import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.repository.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Repository
public class SharedProjectItemDaoJpa {

    @Autowired
    private SharedProjectItemRepository sharedProjectItemsRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void save(
            ProjectType projectType, T projectItem, List<String> users) {
        for (String user : new HashSet<>(users)) {
            User targetUser = this.userDaoJpa.getByName(user);
            SharedProjectItem sharedProjectItem = new SharedProjectItem(user);
            boolean sharedProjectExists;
            switch (projectType) {
                case NOTE:
                    sharedProjectExists = targetUser.hasSharedNotesProject();
                    sharedProjectItem.setNote((Note) projectItem);
                    break;
                case TODO:
                    sharedProjectExists = targetUser.hasSharedTasksProject();
                    sharedProjectItem.setTask((Task) projectItem);
                    break;
                case LEDGER:
                    sharedProjectExists = targetUser.hasSharedTransactionsProject();
                    sharedProjectItem.setTransaction((Transaction) projectItem);
                    break;
                default:
                    throw new IllegalArgumentException();
            }
            if (!sharedProjectExists) {
                Project project = new Project(
                        "Shared " + projectType.name(),
                        projectType.getValue(),
                        this.groupDaoJpa.getDefaultGroup(user),
                        true);
                this.projectRepository.save(project);
            }
            this.sharedProjectItemsRepository.save(sharedProjectItem);
        }
    }

}
