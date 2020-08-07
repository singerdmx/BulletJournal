package com.bulletjournal.repository;

import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.repository.factory.ProjectItemDaos;
import com.bulletjournal.repository.models.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Repository
public class SystemDaoJpa {

    private final ProjectDaoJpa projectDaoJpa;
    private final LabelDaoJpa labelDaoJpa;
    private final Map<ProjectType, ProjectItemDaoJpa> daos;

    @Autowired
    public SystemDaoJpa(
            ProjectDaoJpa projectDaoJpa, LabelDaoJpa labelDaoJpa, ProjectItemDaos projectItemDaos) {
        this.projectDaoJpa = projectDaoJpa;
        this.labelDaoJpa = labelDaoJpa;
        this.daos = projectItemDaos.getDaos();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Label> getProjectLabels(Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        if (project.isShared()) {
            return Collections.emptyList();
        }
        ProjectType projectType = ProjectType.getType(project.getType());
        ProjectItemDaoJpa dao = daos.get(projectType);
        List<Long> labelIds = dao.findItemLabelsByProject(project);
        return this.labelDaoJpa.getLabels(labelIds);
    }
}