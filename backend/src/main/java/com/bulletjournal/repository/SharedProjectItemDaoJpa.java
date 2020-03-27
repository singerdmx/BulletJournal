package com.bulletjournal.repository;

import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.repository.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class SharedProjectItemDaoJpa {

    @Autowired
    private SharedProjectItemRepository sharedProjectItemsRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void save(
            ProjectType projectType, T projectItem, List<String> users) {
        for (String user : users) {
            SharedProjectItem sharedProjectItem = new SharedProjectItem(user);
            switch (projectType) {
                case NOTE:
                    sharedProjectItem.setNote((Note) projectItem);
                    break;
                case TODO:
                    sharedProjectItem.setTask((Task) projectItem);
                    break;
                case LEDGER:
                    sharedProjectItem.setTransaction((Transaction) projectItem);
                    break;
                default:
                    throw new IllegalArgumentException();
            }
            this.sharedProjectItemsRepository.save(sharedProjectItem);
        }
    }
}
