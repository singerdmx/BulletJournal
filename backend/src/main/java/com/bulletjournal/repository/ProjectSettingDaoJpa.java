package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.ProjectSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ProjectSettingDaoJpa {
    @Autowired
    private ProjectSettingRepository projectSettingRepository;

    @Autowired
    private AuthorizationService authorizationService;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.ProjectSetting getProjectSetting(Long projectId) {
        ProjectSetting projectSetting = this.projectSettingRepository.findById(projectId)
                .orElse(null);
        if (projectSetting == null) {
            return new com.bulletjournal.controller.models.ProjectSetting(null, false);
        }
        return projectSetting.toPresentationModel();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ProjectSetting setProjectSetting(String requester, Project project, String color, boolean autoDelete) {
        this.authorizationService.checkAuthorizedToOperateOnContent(
                project.getOwner(), requester, ContentType.PROJECT, Operation.UPDATE, project.getId());
        ProjectSetting setting = this.projectSettingRepository.findById(project.getId())
                .orElse(new ProjectSetting());
        setting.setId(project.getId());
        setting.setProject(project);
        setting.setAutoDelete(autoDelete);
        setting.setColor(color);
        this.projectSettingRepository.save(setting);
        return setting;
    }

}
