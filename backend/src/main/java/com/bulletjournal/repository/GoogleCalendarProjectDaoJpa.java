package com.bulletjournal.repository;

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
    public void create(String calendarId, Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        GoogleCalendarProject googleCalendarProject = new GoogleCalendarProject(calendarId, project);
        this.googleCalendarProjectRepository.save(googleCalendarProject);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Project get(String calendarId) {
        GoogleCalendarProject calendarProject = this.googleCalendarProjectRepository.findById(calendarId)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar " + calendarId + " not found"));
        return calendarProject.getProject();
    }
}
