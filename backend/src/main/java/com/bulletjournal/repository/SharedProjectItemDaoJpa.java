package com.bulletjournal.repository;

import com.bulletjournal.controller.models.CreateProjectParams;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.repository.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
public class SharedProjectItemDaoJpa {

    @Autowired
    private SharedProjectItemRepository sharedProjectItemsRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void save(
            ProjectType projectType, T projectItem, List<String> users) {
        for (String user : users) {
            User targetUser = this.userDaoJpa.getByName(user);
            SharedProjectItem sharedProjectItem = new SharedProjectItem(user);
            boolean sharedProjectExists = false;
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
                CreateProjectParams createProjectParams = new CreateProjectParams(
                        "Shared " + projectType.name(),
                        projectType,
                        null,
                        this.groupDaoJpa.getDefaultGroup(user).getId());
                this.projectDaoJpa.create(createProjectParams, user, new ArrayList<>());
            }
            this.sharedProjectItemsRepository.save(sharedProjectItem);
        }
    }

}
