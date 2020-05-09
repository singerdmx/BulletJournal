package com.bulletjournal.repository;

import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import com.google.common.collect.ImmutableMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public class SystemDaoJpa {

    private final ProjectDaoJpa projectDaoJpa;
    private final LabelDaoJpa labelDaoJpa;
    private final Map<ProjectType, ProjectItemDaoJpa> daos;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    public SystemDaoJpa(
            ProjectDaoJpa projectDaoJpa, LabelDaoJpa labelDaoJpa, TaskDaoJpa taskDaoJpa,
            NoteDaoJpa noteDaoJpa, TransactionDaoJpa transactionDaoJpa) {
        this.projectDaoJpa = projectDaoJpa;
        this.labelDaoJpa = labelDaoJpa;
        this.daos = ImmutableMap.of(
                ProjectType.TODO, taskDaoJpa,
                ProjectType.NOTE, noteDaoJpa,
                ProjectType.LEDGER, transactionDaoJpa
        );
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Label> getProjectItems(Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        ProjectType projectType = ProjectType.getType(project.getType());
        ProjectItemDaoJpa dao = daos.get(projectType);
        List<Long> labelIds = dao.findItemLabelsByProject(project);
        return this.labelDaoJpa.getLabels(labelIds);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getRecentItems(Integer weekNum) {
        List<Task> tasks = this.taskRepository.findRecentTasksBetween(
                Timestamp.valueOf(LocalDateTime.now().minusWeeks(100L)),
                Timestamp.valueOf(LocalDateTime.now()));
        return tasks;
    }
}