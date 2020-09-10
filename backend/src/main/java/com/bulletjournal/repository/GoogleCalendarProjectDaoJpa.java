package com.bulletjournal.repository;

import com.bulletjournal.calendars.google.CalendarWatchedProject;
import com.bulletjournal.calendars.google.Util;
import com.bulletjournal.clients.GoogleCalClient;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.GoogleCalendarProject;
import com.bulletjournal.repository.models.Project;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Repository
public class GoogleCalendarProjectDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(GoogleCalendarProjectDaoJpa.class);
    private static final GsonFactory GSON = new GsonFactory();
    @Autowired
    private GoogleCalendarProjectRepository googleCalendarProjectRepository;
    @Autowired
    private ProjectDaoJpa projectDaoJpa;
    @Autowired
    private GoogleCalClient googleCalClient;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public GoogleCalendarProject create(String calendarId, Long projectId, String channelId,
                                        String channel, String syncToken, String requester,
                                        long expiration) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        ProjectType projectType = ProjectType.getType(project.getType());
        if (!ProjectType.TODO.equals(projectType)) {
            throw new BadRequestException("Invalid project type " + projectType);
        }
        GoogleCalendarProject googleCalendarProject = new GoogleCalendarProject(
                calendarId, project, channelId, channel, syncToken, requester, new Timestamp(expiration));
        return this.googleCalendarProjectRepository.save(googleCalendarProject);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public GoogleCalendarProject get(String calendarId) {
        GoogleCalendarProject calendarProject = this.googleCalendarProjectRepository.findById(calendarId)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar " + calendarId + " not found"));
        return calendarProject;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<CalendarWatchedProject> getByOwner(String owner) {
        List<GoogleCalendarProject> calendarProjects = this.googleCalendarProjectRepository.findByOwner(owner);

        List<CalendarWatchedProject> calendarWatchedProjects = calendarProjects.stream().map(calendarProject ->
                new CalendarWatchedProject(calendarProject.getId(), calendarProject.getProject().toPresentationModel()))
                .collect(Collectors.toList());

        return calendarWatchedProjects;
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

    @Deprecated
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void renewExpiringGoogleCalendarWatch() throws IOException {
        long expirationTime = System.currentTimeMillis() + TimeUnit.DAYS.toMillis(1);
        List<String> expiringGoogleCalendarProjectIds =
                this.googleCalendarProjectRepository.getByExpirationBefore(new Timestamp(expirationTime))
                        .stream().map(p -> p.getId()).collect(Collectors.toList());
        Channel createdChannel;
        for (String googleCalendarProjectId : expiringGoogleCalendarProjectIds) {
            GoogleCalendarProject googleCalendarProject =
                    this.googleCalendarProjectRepository.findById(googleCalendarProjectId).get();
            MDC.put(UserClient.USER_NAME_KEY, googleCalendarProject.getOwner());
            Calendar service = this.googleCalClient.getCalendarService();
            Calendar.Events.Watch watch = service.events().watch(googleCalendarProjectId, Util.getChannel());
            LOGGER.info("Created watch {}", watch);
            createdChannel = watch.execute();

            googleCalendarProject.setChannelId(createdChannel.getId());
            googleCalendarProject.setExpiration(new Timestamp(createdChannel.getExpiration()));
            googleCalendarProject.setChannel(GSON.toString(createdChannel));
            googleCalendarProjectRepository.save(googleCalendarProject);
            LOGGER.info("Renew GoogleCalendarProject {}", googleCalendarProject);
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void renewGoogleCalendarWatch(String googleCalendarProjectId) throws IOException {
        LOGGER.info("Got googleCalendarProjectId {}", googleCalendarProjectId);
        GoogleCalendarProject googleCalendarProject =
                googleCalendarProjectRepository.findById(googleCalendarProjectId).get();
        MDC.put(UserClient.USER_NAME_KEY, googleCalendarProject.getOwner());
        Calendar service = googleCalClient.getCalendarService();
        Calendar.Events.Watch watch = service.events().watch(googleCalendarProjectId, Util.getChannel());
        LOGGER.info("Created watch {}", watch);
        Channel createdChannel = watch.execute();
        googleCalendarProject.setChannelId(createdChannel.getId());
        googleCalendarProject.setExpiration(new Timestamp(createdChannel.getExpiration()));
        googleCalendarProject.setChannel(GSON.toString(createdChannel));
        googleCalendarProjectRepository.save(googleCalendarProject);
        LOGGER.info("Renew GoogleCalendarProject {}, googleCalendarProjectId {}", googleCalendarProject, googleCalendarProjectId);
    }
}