package com.bulletjournal.repository;

import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.GoogleCalendarProject;
import com.bulletjournal.repository.models.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class GoogleCalendarProjectDaoJpa {

    @Autowired
    private GoogleCalendarProjectRepository googleCalendarProjectRepository;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public GoogleCalendarProject create(String calendarId, Long projectId, String channelId,
                                        String channel, String syncToken, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        ProjectType projectType = ProjectType.getType(project.getType());
        if (!ProjectType.TODO.equals(projectType)) {
            throw new BadRequestException("Invalid project type " + projectType);
        }
        GoogleCalendarProject googleCalendarProject = new GoogleCalendarProject(
                calendarId, project, channelId, channel, syncToken);
        return this.googleCalendarProjectRepository.save(googleCalendarProject);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public GoogleCalendarProject get(String calendarId) {
        GoogleCalendarProject calendarProject = this.googleCalendarProjectRepository.findById(calendarId)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar " + calendarId + " not found"));
        return calendarProject;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public GoogleCalendarProject getByChannelId(String channelId) {
        GoogleCalendarProject calendarProject = this.googleCalendarProjectRepository.getByChannelId(channelId)
                .orElseThrow(() -> new ResourceNotFoundException("Channel " + channelId + " not found"));
        return calendarProject;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void delete(String calendarId) {
        this.googleCalendarProjectRepository.delete(get(calendarId));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public GoogleCalendarProject setTokenByCalendarId(String calendarId, String token) {
        GoogleCalendarProject googleCalendarProject = get(calendarId);
        googleCalendarProject.setToken(token);
        return this.googleCalendarProjectRepository.save(googleCalendarProject);
    }

}
