package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.hierarchy.HierarchyProcessorProcessorTest;
import com.bulletjournal.notifications.Action;
import com.bulletjournal.notifications.JoinGroupEvent;
import com.google.common.collect.ImmutableList;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Tests {@link ProjectController}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ProjectControllerTest {
    private static final String ROOT_URL = "http://localhost:";
    private final String expectedOwner = "BulletJournal";
    private final String[] sampleUsers = {
            "Xavier",
            "bbs1024",
            "ccc",
            "Thinker",
            "Joker",
            "mqm",
            "hero",
            "bean",
            "xlf",
            "999999",
            "0518",
            "Scarlet",
            "lsx9981"};
    private TestRestTemplate restTemplate = new TestRestTemplate();

    @LocalServerPort
    int randomServerPort;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    @Test
    public void testCRUD() throws Exception {
        String notificationsEtag = answerNotifications();
        String projectName = "P0";
        List<GroupsWithOwner> groups = createGroups(expectedOwner);
        Group group = groups.get(0).getGroups().get(0);
        int count = 6;
        for (String username : Arrays.asList(sampleUsers).subList(0, 3)) {
            group = addUserToGroup(group, username, ++count);
        }

        for (String username : Arrays.asList(sampleUsers).subList(0, 2)) {
            removeUserFromGroup(group, username,  --count);
        }

        group = groups.get(0).getGroups().get(2);
        addUsersToGroup(group, Arrays.asList(sampleUsers).subList(0, 5));
        removeUsersFromGroup(group, Arrays.asList(sampleUsers).subList(0, 5), 1);

        Project p1 = createProject(projectName, expectedOwner, group);
        p1 = updateProject(p1);

        // create other projects
        Project p2 = createProject("P2", expectedOwner, group);
        Project p3 = createProject("P3", expectedOwner, group);
        Project p4 = createProject("P4", expectedOwner, group);
        Project p5 = createProject("P5", expectedOwner, group);
        Project p6 = createProject("P6", expectedOwner, group);
        updateProjectRelations(p1, p2, p3, p4, p5, p6);

        deleteProject(p1);

        createTasks(p5);
        Note note1 = createNotes(p5, "test111");
        Note note2 = createNotes(p5, "test2");
        Note note3 = createNotes(p5, "test3");
        updateNoteRelations(p5, note1);
        updateNoteRelations(p5, note2);
        updateNote(note1);
//        deleteNote(note2);
    }

    private Note createNotes(Project p5, String noteName) {
            CreateNoteParams note = new CreateNoteParams(noteName);
            ResponseEntity<Note> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NoteController.NOTES_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(note),
                Note.class,
                p5.getId());
        Note created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(noteName, created.getName());
        assertEquals(p5.getId(), created.getProjectId());
        return created;
    }

    private Note getNote(Note note1) {
           ResponseEntity<Note> response = this.restTemplate.exchange(
                   ROOT_URL + randomServerPort + NoteController.NOTE_ROUTE,
                   HttpMethod.GET,
                   null,
                   Note.class,
                   note1.getId());
           Note outputNote = response.getBody();
           assertEquals(HttpStatus.OK, response.getStatusCode());
           assertEquals(note1.getName(), outputNote.getName());
           return outputNote;
    }

    private Note updateNote(Note n1) {
        // update project name from "P0" to "P1"
        String noteName = "test111";
        UpdateNoteParams updateNoteParams = new UpdateNoteParams();
        updateNoteParams.setName(noteName);
        ResponseEntity<Note> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NoteController.NOTE_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateNoteParams),
                Note.class,
                n1.getId());
        n1 = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(noteName, n1.getName());
        return n1;
    }

    private void updateNoteRelations(Project p1, Note note1) {
        List<Note> notes = new ArrayList<>();
        List<Note> subNotes = new ArrayList<>();
        note1.setSubNotes(subNotes);
        notes.add(note1);
        ResponseEntity<?> updateNoteRelationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NoteController.NOTES_ROUTE,
                HttpMethod.PUT,
                new HttpEntity<>(notes),
                Project.class,
                note1.getId()
        );
        assertEquals(HttpStatus.OK, updateNoteRelationsResponse.getStatusCode());
    }

    private void deleteNote(Note note1) {

        ResponseEntity<Note> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NoteController.NOTE_ROUTE,
                HttpMethod.DELETE,
                null,
                Note.class,
                note1.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    private HttpEntity actAsOtherUser(String username) {
        final HttpHeaders headers = new HttpHeaders();
        headers.set(UserClient.USER_NAME_KEY, username);

        return new HttpEntity<>(headers);
    }

    private void createTasks(Project project) {
        Task t1 = createTask(project, "t1");
        Task t2 = createTask(project, "t2");
        Task t3 = createTask(project, "t3");
        updateTask(t1, null, "2020-02-28", null, null, null, t1.getName());
    }

    private Task createTask(Project project, String taskName) {
        CreateTaskParams task = new CreateTaskParams(taskName, null, null);
        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(task),
                Task.class,
                project.getId());
        Task created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(taskName, created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }


    private Task updateTask(Task task, String assignedTo, String dueDate,
                            String dueTime, String name, ReminderSetting reminderSetting, String expectedName) {
        //update task parameter
        UpdateTaskParams updateTaskParams = new UpdateTaskParams(assignedTo, dueDate, dueTime, name, reminderSetting);
        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASK_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateTaskParams),
                Task.class,
                task.getId());
        Task updated = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedOwner, updated.getAssignedTo());
        assertEquals(dueDate, updated.getDueDate());
        assertEquals(dueTime, updated.getDueTime());
        assertEquals(expectedName, updated.getName());
        return updated;
    }

    private void deleteProject(Project p) {
        /**  After deletion
         *
         *  p5
         *   |
         *    -- p6
         */

        ResponseEntity<?> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECT_ROUTE,
                HttpMethod.DELETE,
                null,
                Void.class,
                p.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ResponseEntity<Projects> getResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Projects.class);
        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        List<Project> projects = getResponse.getBody().getOwned();
        assertEquals(1, projects.size());
        assertEquals("P5", projects.get(0).getName());
        assertEquals(1, projects.get(0).getSubProjects().size());
        assertEquals("P6", projects.get(0).getSubProjects().get(0).getName());
    }

    private String answerNotifications() {
        ResponseEntity<Notification[]> notificationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NotificationController.NOTIFICATIONS_ROUTE,
                HttpMethod.GET,
                null,
                Notification[].class);
        String etag = notificationsResponse.getHeaders().getETag();
        validateNotificationResponseEtagMatch(etag);
        assertEquals(HttpStatus.OK, notificationsResponse.getStatusCode());
        List<Notification> notifications = Arrays.asList(notificationsResponse.getBody());
        assertEquals(9, notifications.size());
        // reject invitations to join group
        for (int i = 1; i < notifications.size() - 1; i++) {
            Notification notification = notifications.get(i);
            AnswerNotificationParams answerNotificationParams =
                    new AnswerNotificationParams(Action.DECLINE.getDescription());
            ResponseEntity<?> response = this.restTemplate.exchange(
                    ROOT_URL + randomServerPort + NotificationController.ANSWER_NOTIFICATION_ROUTE,
                    HttpMethod.POST,
                    new HttpEntity<>(answerNotificationParams),
                    Void.class,
                    notification.getId());
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(JoinGroupEvent.class.getSimpleName(), notification.getType());
        }
        return etag;
    }

    private void validateNotificationResponseEtagMatch(String expectedEtag) {
        ResponseEntity<Notification[]> notificationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NotificationController.NOTIFICATIONS_ROUTE,
                HttpMethod.GET,
                null,
                Notification[].class);

        assertEquals(HttpStatus.OK, notificationsResponse.getStatusCode());

        String etag = notificationsResponse.getHeaders().getETag();
        assertEquals(expectedEtag, etag);
    }

    private void updateProjectRelations(Project p1, Project p2, Project p3, Project p4, Project p5, Project p6) {
        ResponseEntity<Projects> getProjectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Projects.class);
        String[] eTags = getProjectsResponse.getHeaders().getETag().split("\\|");
        assertEquals(2, eTags.length);
        String ownedProjectsEtag = eTags[0];
        String sharedProjectsEtag = eTags[1];
        validateProjectResponseEtagMatch(ownedProjectsEtag, sharedProjectsEtag);

        /**
         *  p1
         *   |
         *    -- p2
         *   |   |
         *   |    -- p3
         *   |
         *    -- p4
         *
         *  p5
         *   |
         *    -- p6
         */
        List<Project> projectRelations = HierarchyProcessorProcessorTest.createSampleProjectRelations(
                p1, p2, p3, p4, p5, p6);
        // Set user's project relations
        ResponseEntity<?> updateProjectRelationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.PUT,
                new HttpEntity<>(projectRelations),
                Void.class
        );
        assertEquals(HttpStatus.OK, updateProjectRelationsResponse.getStatusCode());

        ResponseEntity<Projects> projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Projects.class);
        assertEquals(HttpStatus.OK, projectsResponse.getStatusCode());
        List<Project> projects = projectsResponse.getBody().getOwned();
        assertEquals(2, projects.size());
        assertEquals(p1, projects.get(0));
        assertEquals(p5, projects.get(1));
        assertEquals(2, projects.get(0).getSubProjects().size());
        assertEquals(p2, projects.get(0).getSubProjects().get(0));
        assertEquals(p4, projects.get(0).getSubProjects().get(1));
        assertEquals(1, projects.get(1).getSubProjects().size());
        assertEquals(p6, projects.get(1).getSubProjects().get(0));
        assertEquals(1, projects.get(0).getSubProjects().get(0).getSubProjects().size());
        assertEquals(p3, projects.get(0).getSubProjects().get(0).getSubProjects().get(0));

        List<ProjectsWithOwner> l = projectsResponse.getBody().getShared();
        assertEquals(2, l.size());
        projects = l.get(0).getProjects();
        assertEquals("Scarlet", l.get(0).getOwner());
        assertEquals(2, projects.size());
        assertEquals("P1", projects.get(0).getName());
        assertEquals("P5", projects.get(1).getName());
        assertEquals(2, projects.get(0).getSubProjects().size());
        assertEquals("P2", projects.get(0).getSubProjects().get(0).getName());
        assertEquals("P4", projects.get(0).getSubProjects().get(1).getName());
        assertEquals(1, projects.get(1).getSubProjects().size());
        assertEquals("P6", projects.get(1).getSubProjects().get(0).getName());
        assertEquals(1, projects.get(0).getSubProjects().get(0).getSubProjects().size());
        assertEquals("P3", projects.get(0).getSubProjects().get(0).getSubProjects().get(0).getName());

        projects = l.get(1).getProjects();
        assertEquals("lsx9981", l.get(1).getOwner());
        assertEquals(1, projects.size());
        assertEquals("P1", projects.get(0).getName());

        // change order of shared projects
        UpdateSharedProjectsOrderParams updateSharedProjectsOrderParams =
                new UpdateSharedProjectsOrderParams(new String[]{"lsx9981", "Scarlet"});
        ResponseEntity<?> updateSharedProjectsOrderResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.UPDATE_SHARED_PROJECTS_ORDER_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(updateSharedProjectsOrderParams),
                Void.class);
        assertEquals(HttpStatus.OK, updateSharedProjectsOrderResponse.getStatusCode());
        projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Projects.class);
        assertEquals(HttpStatus.OK, projectsResponse.getStatusCode());
        l = projectsResponse.getBody().getShared();
        assertEquals(2, l.size());
        projects = l.get(0).getProjects();
        assertEquals("lsx9981", l.get(0).getOwner());
        assertEquals(1, projects.size());

        projects = l.get(1).getProjects();
        assertEquals("Scarlet", l.get(1).getOwner());
        assertEquals(2, projects.size());


        validateProjectResponseEtagNotMatch(ownedProjectsEtag, sharedProjectsEtag);
    }

    private void validateProjectResponseEtagMatch(String ownedProjectsEtag, String sharedProjectsEtag) {
        ResponseEntity<Projects> projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Projects.class);

        assertEquals(HttpStatus.OK, projectsResponse.getStatusCode());

        String[] eTags = projectsResponse.getHeaders().getETag().split("\\|");
        assertEquals(2, eTags.length);
        assertEquals(ownedProjectsEtag, eTags[0]);
        assertEquals(sharedProjectsEtag, eTags[1]);
    }

    private void validateProjectResponseEtagNotMatch(String ownedProjectsEtag, String sharedProjectsEtag) {
        ResponseEntity<Projects> projectsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.GET,
                null,
                Projects.class);
        assertEquals(HttpStatus.OK, projectsResponse.getStatusCode());
        String[] eTags = projectsResponse.getHeaders().getETag().split("\\|");
        assertEquals(2, eTags.length);
        assertNotEquals(ownedProjectsEtag, eTags[0]);
        assertNotEquals(sharedProjectsEtag, eTags[1]);
    }

    private Project updateProject(Project p1) {
        // update project name from "P0" to "P1"
        String projectNewName = "P1";
        UpdateProjectParams updateProjectParams = new UpdateProjectParams();
        updateProjectParams.setName(projectNewName);
        updateProjectParams.setDescription("d2");
        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECT_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateProjectParams),
                Project.class,
                p1.getId());
        p1 = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(projectNewName, p1.getName());
        assertEquals(expectedOwner, p1.getOwner());
        assertEquals(ProjectType.LEDGER, p1.getProjectType());
        assertEquals("G1", p1.getGroup().getName());
        assertEquals(expectedOwner, p1.getGroup().getOwner());
        assertEquals("d2", p1.getDescription());
        return p1;
    }

    private void getNotifications(String notificationsEtag) {
        ResponseEntity<Notification[]> notificationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NotificationController.NOTIFICATIONS_ROUTE,
                HttpMethod.GET,
                null,
                Notification[].class);
        assertEquals(HttpStatus.OK, notificationsResponse.getStatusCode());
        assertNotEquals(notificationsEtag, notificationsResponse.getHeaders().getETag());

        List<Notification> notifications = Arrays.asList(notificationsResponse.getBody());
        assertEquals(2, notifications.size());
        Notification notification = notifications.get(0);
        assertEquals("Xavier invited you to join Group Default", notification.getTitle());
        assertNull(notification.getContent());
        assertEquals("Xavier", notification.getOriginator().getName());
        assertEquals(ImmutableList.of(Action.ACCEPT.getDescription(), Action.DECLINE.getDescription()),
                notification.getActions());
        assertEquals(JoinGroupEvent.class.getSimpleName(), notification.getType());

        notificationsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + NotificationController.NOTIFICATIONS_ROUTE,
                HttpMethod.GET,
                actAsOtherUser(sampleUsers[0]),
                Notification[].class);
        assertEquals(HttpStatus.OK, notificationsResponse.getStatusCode());
        notifications = Arrays.asList(notificationsResponse.getBody());
        assertEquals(4, notifications.size());
    }

    private List<GroupsWithOwner> getGroups(List<GroupsWithOwner> expected) {
        ResponseEntity<GroupsWithOwner[]> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.GET,
                null,
                GroupsWithOwner[].class);
        String etag = groupsResponse.getHeaders().getETag();
        List<GroupsWithOwner> groupsBody = Arrays.asList(groupsResponse.getBody());
        if (expected != null) {
            assertEquals(expected.size(), groupsBody.size());
            for (int i = 0; i < expected.size(); i++) {
                assertEquals(expected.get(i), groupsBody.get(i));
            }
        }

        validateGroupsResponseEtagMatch(etag);
        return groupsBody;
    }

    private void validateGroupsResponseEtagMatch(String etag) {
        ResponseEntity<GroupsWithOwner[]> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.GET,
                null,
                GroupsWithOwner[].class);
        assertEquals(HttpStatus.OK, groupsResponse.getStatusCode());
        assertEquals(etag, groupsResponse.getHeaders().getETag());
    }

    private List<GroupsWithOwner> createGroups(String owner) {
        List<GroupsWithOwner> groups = getGroups(null);
        assertEquals(4, groups.size());
        Group g = groups.get(0).getGroups().get(0);
        assertEquals(expectedOwner, g.getOwner());
        assertEquals(6, g.getUsers().size());
        Group secondOwnedGroup = groups.get(0).getGroups().get(1);
        assertEquals(expectedOwner, secondOwnedGroup.getOwner());
        assertEquals(1, secondOwnedGroup.getUsers().size());
        Group invitedToJoin = groups.get(2).getGroups().get(0);
        assertEquals(2, invitedToJoin.getUsers().size());
        assertEquals("Xavier", invitedToJoin.getOwner());
        assertEquals("Xavier", invitedToJoin.getUsers().get(0).getName());
        assertEquals(true, invitedToJoin.getUsers().get(0).isAccepted());
        assertEquals(expectedOwner, invitedToJoin.getUsers().get(1).getName());
        assertEquals(true, invitedToJoin.getUsers().get(1).isAccepted());
        Group joinedGroup = groups.get(1).getGroups().get(0);
        assertEquals(2, joinedGroup.getUsers().size());
        assertEquals("Scarlet", joinedGroup.getOwner());
        assertEquals("Scarlet", joinedGroup.getUsers().get(0).getName());
        assertEquals(true, joinedGroup.getUsers().get(0).isAccepted());
        assertEquals(expectedOwner, joinedGroup.getUsers().get(1).getName());
        assertEquals(true, joinedGroup.getUsers().get(1).isAccepted());
        Group joinedGroup2 = groups.get(3).getGroups().get(0);
        Group g1 = createGroup("G0", owner);
        Group g2 = createGroup("G2", owner);
        Group g3 = createGroup("G3", owner);
        getGroups(ImmutableList.of(
                new GroupsWithOwner(expectedOwner, ImmutableList.of(g, secondOwnedGroup, g1, g2, g3)),
                new GroupsWithOwner("Scarlet", ImmutableList.of(joinedGroup)),
                new GroupsWithOwner("Xavier", ImmutableList.of(invitedToJoin)),
                new GroupsWithOwner("lsx9981", ImmutableList.of(joinedGroup2))));

        String groupNewName = "G1";
        UpdateGroupParams updateGroupParams = new UpdateGroupParams();
        updateGroupParams.setName(groupNewName);

        // Update group name from "G0" to "G1"
        ResponseEntity<Group> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUP_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateGroupParams),
                Group.class,
                g1.getId());
        g1 = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(groupNewName, g1.getName());

        // Delete Group "G3"
        ResponseEntity<?> deleteResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUP_ROUTE,
                HttpMethod.DELETE,
                null,
                Void.class,
                g3.getId());
        assertEquals(HttpStatus.OK, deleteResponse.getStatusCode());
        groups = getGroups(ImmutableList.of(
                new GroupsWithOwner(expectedOwner, ImmutableList.of(g, secondOwnedGroup, g1, g2)),
                new GroupsWithOwner("Scarlet", ImmutableList.of(joinedGroup)),
                new GroupsWithOwner("Xavier", ImmutableList.of(invitedToJoin)),
                new GroupsWithOwner("lsx9981", ImmutableList.of(joinedGroup2))));

        // Delete Group "Default"
        deleteResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUP_ROUTE,
                HttpMethod.DELETE,
                null,
                Void.class,
                g.getId());
        assertEquals(HttpStatus.UNAUTHORIZED, deleteResponse.getStatusCode());
        groups = getGroups(ImmutableList.of(
                new GroupsWithOwner(expectedOwner, ImmutableList.of(g, secondOwnedGroup, g1, g2)),
                new GroupsWithOwner("Scarlet", ImmutableList.of(joinedGroup)),
                new GroupsWithOwner("Xavier", ImmutableList.of(invitedToJoin)),
                new GroupsWithOwner("lsx9981", ImmutableList.of(joinedGroup2))));
        return groups;
    }

    private List<GroupsWithOwner> addUsersToGroup(final Group group, List<String> usernames) {
        AddUserGroupsParams addUserGroupsParams = new AddUserGroupsParams();
        for (String username : usernames) {
            addUserGroupsParams.getUserGroups().add(new AddUserGroupParams(group.getId(), username));
        }
        ResponseEntity<GroupsWithOwner[]> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.ADD_USER_GROUPS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(addUserGroupsParams),
                GroupsWithOwner[].class);
        List<GroupsWithOwner> groups = Arrays.asList(groupsResponse.getBody());
        Group updated = groups.stream().filter(g -> group.getOwner().equals(g.getOwner()))
                .findFirst().get().getGroups()
                .stream().filter(g -> group.getName().equals(g.getName())).findFirst().get();
        assertEquals(usernames.size() + 1, updated.getUsers().size());
        return groups;
    }

    private Group addUserToGroup(Group group, String username, int expectedSize) {
        AddUserGroupParams addUserGroupParams = new AddUserGroupParams(group.getId(), username);
        ResponseEntity<Group> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.ADD_USER_GROUP_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(addUserGroupParams),
                Group.class);
        Group updated = groupsResponse.getBody();
        assertEquals(expectedSize, updated.getUsers().size());
        return updated;
    }

    private void removeUsersFromGroup(final Group group, List<String> usernames, int count) {
        RemoveUserGroupsParams removeUserGroupsParams = new RemoveUserGroupsParams();
        for (String username : usernames) {
            removeUserGroupsParams.getUserGroups().add(new RemoveUserGroupParams(group.getId(), username));
        }

        this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.REMOVE_USER_GROUPS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(removeUserGroupsParams),
                Void.class);

        ResponseEntity<GroupsWithOwner[]> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.GET,
                null,
                GroupsWithOwner[].class);
        List<GroupsWithOwner> groupsWithOwners = Arrays.asList(groupsResponse.getBody());
        Group resultGroup = groupsWithOwners.stream().filter(g -> group.getOwner().equals(g.getOwner()))
                .findFirst().get().getGroups()
                .stream().filter(g -> group.getId().equals(g.getId())).findFirst().get();
        assertEquals(count, resultGroup.getUsers().size());
    }

    private void removeUserFromGroup(Group group, String username, int count) {
        RemoveUserGroupParams removeUserGroupParams = new RemoveUserGroupParams(group.getId(), username);
        this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.REMOVE_USER_GROUP_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(removeUserGroupParams),
                Void.class);

        ResponseEntity<GroupsWithOwner[]> groupsResponse = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.GET,
                null,
                GroupsWithOwner[].class);

        List<GroupsWithOwner> groupsWithOwners = Arrays.asList(groupsResponse.getBody());
        Group resultGroup = groupsWithOwners.stream().filter(g -> group.getOwner().equals(g.getOwner()))
                .findFirst().get().getGroups()
                .stream().filter(g -> group.getId().equals(g.getId())).findFirst().get();
        assertEquals(count, resultGroup.getUsers().size());
    }

    private Group createGroup(String groupName, String expectedOwner) {
        CreateGroupParams group = new CreateGroupParams(groupName);
        ResponseEntity<Group> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + GroupController.GROUPS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(group),
                Group.class);
        Group created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(groupName, created.getName());
        assertEquals(expectedOwner, created.getOwner());

        return created;
    }

    private Project createProject(String projectName, String expectedOwner, Group g) {
        CreateProjectParams project = new CreateProjectParams(
                projectName, ProjectType.LEDGER, "d1", g.getId());
        ResponseEntity<Project> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + ProjectController.PROJECTS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(project),
                Project.class);
        Project created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(projectName, created.getName());
        assertEquals(expectedOwner, created.getOwner());
        assertEquals(ProjectType.LEDGER, created.getProjectType());
        assertEquals("G1", created.getGroup().getName());
        assertEquals(expectedOwner, created.getGroup().getOwner());
        assertEquals("d1", created.getDescription());
        return created;
    }
}

