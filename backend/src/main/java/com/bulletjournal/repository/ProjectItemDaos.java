package com.bulletjournal.repository;

import com.bulletjournal.controller.models.ProjectType;
import com.google.common.collect.ImmutableMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ProjectItemDaos {

    private Map<ProjectType, ProjectItemDaoJpa> daos;

    @Autowired
    public ProjectItemDaos(TaskDaoJpa taskDaoJpa,
            NoteDaoJpa noteDaoJpa, TransactionDaoJpa transactionDaoJpa) {
        this.daos = ImmutableMap.of(
                ProjectType.TODO, taskDaoJpa,
                ProjectType.NOTE, noteDaoJpa,
                ProjectType.LEDGER, transactionDaoJpa
        );
    }

    public Map<ProjectType, ProjectItemDaoJpa> getDaos() {
        return daos;
    }
}
