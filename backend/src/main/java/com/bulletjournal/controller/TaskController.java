package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.es.ESUtil;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.notifications.*;
import com.bulletjournal.repository.ProjectDaoJpa;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.TaskRepository;
import com.bulletjournal.repository.models.CompletedTask;
import com.bulletjournal.repository.models.ContentModel;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.bulletjournal.repository.models.TaskContent;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.IF_NONE_MATCH;

@RestController
public class TaskController {

    public static final String TASKS_ROUTE = "/api/projects/{projectId}/tasks";
    protected static final String TASK_ROUTE = "/api/tasks/{taskId}";
    protected static final String SET_TASK_STATUS_ROUTE = "/api/tasks/{taskId}/setStatus";
    protected static final String COMPLETED_TASK_ROUTE = "/api/completedTasks/{taskId}";
    protected static final String COMPLETE_TASKS_ROUTE = "/api/projects/{projectId}/complete";
    protected static final String COMPLETE_TASK_ROUTE = "/api/tasks/{taskId}/complete";
    protected static final String UNCOMPLETE_TASK_ROUTE = "/api/tasks/{taskId}/uncomplete";
    protected static final String COMPLETED_TASKS_ROUTE = "/api/projects/{projectId}/completedTasks";
    protected static final String TASK_SET_LABELS_ROUTE = "/api/tasks/{taskId}/setLabels";
    protected static final String MOVE_TASK_ROUTE = "/api/tasks/{taskId}/move";
    protected static final String SHARE_TASK_ROUTE = "/api/tasks/{taskId}/share";
    protected static final String GET_SHARABLES_ROUTE = "/api/tasks/{taskId}/sharables";
    protected static final String REVOKE_SHARABLE_ROUTE = "/api/tasks/{taskId}/revokeSharable";
    protected static final String REMOVE_SHARED_ROUTE = "/api/tasks/{taskId}/removeShared";
    protected static final String ADD_CONTENT_ROUTE = "/api/tasks/{taskId}/addContent";
    protected static final String CONTENT_ROUTE = "/api/tasks/{taskId}/contents/{contentId}";
    public static final String CONTENTS_ROUTE = "/api/tasks/{taskId}/contents";
    protected static final String COMPLETED_TASK_CONTENTS_ROUTE = "/api/completedTasks/{taskId}/contents";
    protected static final String CONTENT_REVISIONS_ROUTE = "/api/tasks/{taskId}/contents/{contentId}/revisions/{revisionId}";
    protected static final String TASK_STATISTICS_ROUTE = "/api/taskStatistics";
    protected static final String REVISION_CONTENT_ROUTE = "/api/tasks/{taskId}/contents/{contentId}/patchRevisionContents";

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserClient userClient;

    @GetMapping(TASKS_ROUTE)
    public ResponseEntity<List<Task>> getTasks(@NotNull @PathVariable Long projectId,
            @RequestParam(required = false) String assignee, @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate, @RequestParam(required = false) Boolean order,
            @RequestParam(required = false) String timezone) {
        if (StringUtils.isNotBlank(assignee)) {
            return getTasksByAssignee(projectId, assignee);
        }
        if (Boolean.TRUE.equals(order)) {
            return getTasksByOrder(projectId, startDate, endDate, timezone);
        }

        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Task> tasks = this.taskDaoJpa.getTasks(projectId, username);
        String tasksEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, tasks);

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(tasksEtag);

        return ResponseEntity.ok().headers(responseHeader).body(ProjectItem.addAvatar(tasks, this.userClient));
    }

    private ResponseEntity<List<Task>> getTasksByAssignee(Long projectId, String assignee) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Task> tasks = this.taskDaoJpa.getTasksByAssignee(projectId, username, assignee);
        return ResponseEntity.ok().body(ProjectItem.addAvatar(tasks, this.userClient));
    }

    private ResponseEntity<List<Task>> getTasksByOrder(Long projectId, String startDate, String endDate,
            String timezone) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Task> tasks = this.taskDaoJpa.getTasksByOrder(projectId, username, startDate, endDate, timezone);
        return ResponseEntity.ok().body(ProjectItem.addAvatar(tasks, this.userClient));
    }

    @GetMapping(TASK_ROUTE)
    public Task getTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return ProjectItem.addAvatar(this.taskDaoJpa.getTask(username, taskId), this.userClient);
    }

    @GetMapping(COMPLETED_TASK_ROUTE)
    public Task getCompletedTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return ProjectItem.addAvatar(this.taskDaoJpa.getCompletedTask(taskId, username).toPresentationModel(),
                this.userClient);
    }

    @PostMapping(TASKS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@NotNull @PathVariable Long projectId, @Valid @RequestBody CreateTaskParams task) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        com.bulletjournal.repository.models.Task createdTask = taskDaoJpa.create(projectId, username, task);
        this.notificationService.remind(new Remindable(createdTask));
        String projectName = createdTask.getProject().getName();
        this.notificationService.trackActivity(new Auditable(projectId,
                "created Task ##" + createdTask.getName() + "## in BuJo ##" + projectName + "##", username,
                createdTask.getId(), Timestamp.from(Instant.now()), ContentAction.ADD_TASK));
        return createdTask.toPresentationModel();
    }

    @PatchMapping(TASK_ROUTE)
    public ResponseEntity<List<Task>> updateTask(@NotNull @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskParams updateTaskParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<UpdateTaskAssigneeEvent> events = new ArrayList<>();

        com.bulletjournal.repository.models.Task updatedTask = this.taskDaoJpa.partialUpdate(username, taskId,
                updateTaskParams, events);
        this.notificationService.remind(new Remindable(updatedTask));
        Long projectId = updatedTask.getProject().getId();
        String projectName = updatedTask.getProject().getName();
        if (!events.isEmpty()) {
            events.forEach((event) -> notificationService.inform(event));
        }

        this.notificationService.trackActivity(new Auditable(projectId,
                "updated Task ##" + updatedTask.getName() + "## in BuJo ##" + projectName + "##", username,
                updatedTask.getId(), Timestamp.from(Instant.now()), ContentAction.UPDATE_TASK));
        return getTasks(projectId, null, null, null, null, null);
    }

    @PutMapping(TASKS_ROUTE)
    public ResponseEntity<List<Task>> updateTaskRelations(@NotNull @PathVariable Long projectId,
            @Valid @RequestBody List<Task> tasks, @RequestHeader(IF_NONE_MATCH) Optional<String> tasksEtag) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.taskDaoJpa.updateUserTasks(projectId, tasks, username);
        return getTasks(projectId, null, null, null, null, null);
    }

    @PostMapping(COMPLETE_TASK_ROUTE)
    public Task completeTask(@NotNull @PathVariable Long taskId, @RequestBody Optional<String> dateTime) {
        CompletedTask task = completeSingleTask(taskId, dateTime.orElse(null));

        return getCompletedTask(task.getId());
    }

    private CompletedTask completeSingleTask(Long taskId, String dateTime) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        List<String> deleteESDocumentIds = this.taskDaoJpa.getDeleteESDocumentIdsForProjectItem(username, taskId);

        CompletedTask task = this.taskDaoJpa.complete(username, taskId, dateTime);

        this.notificationService.deleteESDocument(new RemoveElasticsearchDocumentEvent(deleteESDocumentIds));
        this.notificationService.trackActivity(new Auditable(task.getProject().getId(),
                "completed Task ##" + task.getName() + "## in BuJo ##" + task.getProject().getName() + "##", username,
                task.getId(), Timestamp.from(Instant.now()), ContentAction.COMPLETE_TASK));
        return task;
    }

    @PostMapping(COMPLETE_TASKS_ROUTE)
    public ResponseEntity<List<Task>> completeTasks(@NotNull @PathVariable Long projectId,
            @RequestParam List<Long> tasks) {

        tasks.forEach(t -> {
            if (this.taskRepository.existsById(t)) {
                this.completeSingleTask(t, null);
            }
        });

        return getTasks(projectId, null, null, null, null, null);
    }

    @PostMapping(SET_TASK_STATUS_ROUTE)
    public ResponseEntity<List<Task>> setTaskStatus(@NotNull @PathVariable Long taskId,
            @RequestBody SetTaskStatusParams setTaskStatusParams) {

        String username = MDC.get(UserClient.USER_NAME_KEY);
        TaskStatus taskStatus = setTaskStatusParams.getStatus();
        Pair<com.bulletjournal.repository.models.Task, List<Event>> res = this.taskDaoJpa
                .setTaskStatus(taskStatus, taskId, username);
        com.bulletjournal.repository.models.Task updatedTask = res.getLeft();
        List<Event> events = res.getRight();

        if (!events.isEmpty()) {
            this.notificationService.inform(new SetTaskStatusEvent(events, username));
        }

        this.notificationService.trackActivity(new Auditable(updatedTask.getProject().getId(),
                "set Task ##" + updatedTask.getName() + "## to ##"
                        + TaskStatus.toText(taskStatus) + "## in BuJo ##"
                        + updatedTask.getProject().getName() + "##",
                username, updatedTask.getId(), Timestamp.from(Instant.now()), ContentAction.UPDATE_TASK));

        return getTasks(updatedTask.getProject().getId(), null, null, null,
                true, setTaskStatusParams.getTimezone());
    }

    @PostMapping(UNCOMPLETE_TASK_ROUTE)
    public Task uncompleteTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Pair<Long, CompletedTask> res = this.taskDaoJpa.uncomplete(username, taskId);
        Long newId = res.getLeft();
        CompletedTask task = res.getRight();

        this.notificationService.trackActivity(new Auditable(task.getProject().getId(),
                "uncompleted Task ##" + task.getName() + "## in BuJo ##" + task.getProject().getName() + "##", username,
                task.getId(), Timestamp.from(Instant.now()), ContentAction.UNCOMPLETE_TASK));

        return getTask(newId);
    }

    @GetMapping(COMPLETED_TASKS_ROUTE)
    public List<Task> getCompletedTasks(@NotNull @PathVariable Long projectId,
            @RequestParam(required = false, defaultValue = "0") Integer pageNo,
            @RequestParam(required = false, defaultValue = "50") Integer pageSize,
            @RequestParam(required = false) String assignee, @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate, @RequestParam(required = false) String timezone) {

        if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate)) {
            return getCompletedTasksBetween(projectId, assignee, startDate, endDate, timezone);
        }

        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.taskDaoJpa.getCompletedTasks(projectId, username, pageNo, pageSize).stream()
                .map(t -> ProjectItem.addAvatar(t.toPresentationModel(), this.userClient)).collect(Collectors.toList());
    }

    private List<Task> getCompletedTasksBetween(Long projectId, String assignee, String startDate, String endDate,
            String timezone) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.taskDaoJpa.getCompletedTasksBetween(projectId, assignee, username, startDate, endDate, timezone)
                .stream().map(t -> ProjectItem.addAvatar(t.toPresentationModel(), this.userClient))
                .collect(Collectors.toList());
    }

    @DeleteMapping(TASK_ROUTE)
    public ResponseEntity<List<Task>> deleteTask(@NotNull @PathVariable Long taskId) {
        Long projectId = deleteSingleTask(taskId);
        return getTasks(projectId, null, null, null, null, null);
    }

    private Long deleteSingleTask(Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        List<String> deleteESDocumentIds = this.taskDaoJpa.getDeleteESDocumentIdsForProjectItem(username, taskId);

        Pair<List<Event>, com.bulletjournal.repository.models.Task> res = this.taskDaoJpa.deleteTask(username, taskId);
        List<Event> events = res.getLeft();
        String taskName = res.getRight().getName();
        Long projectId = res.getRight().getProject().getId();
        String projectName = res.getRight().getProject().getName();
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveTaskEvent(events, username));
        }
        this.notificationService.deleteESDocument(new RemoveElasticsearchDocumentEvent(deleteESDocumentIds));
        this.notificationService.trackActivity(
                new Auditable(projectId, "deleted Task ##" + taskName + "## in BuJo ##" + projectName + "##", username,
                        taskId, Timestamp.from(Instant.now()), ContentAction.DELETE_TASK));
        return projectId;
    }

    @DeleteMapping(TASKS_ROUTE)
    public ResponseEntity<List<Task>> deleteTasks(@NotNull @PathVariable Long projectId,
            @NotNull @RequestParam List<Long> tasks) {
        // curl -X DELETE
        // "http://localhost:8080/api/projects/11/transactions?transactions=12&transactions=11&transactions=13&transactions=14"
        // -H "accept: */*"
        if (tasks.isEmpty()) {
            return getTasks(projectId, null, null, null, null, null);
        }

        String username = MDC.get(UserClient.USER_NAME_KEY);
        com.bulletjournal.repository.models.Project project = this.projectDaoJpa.getProject(projectId, username);
        List<com.bulletjournal.repository.models.Task> taskList =
                this.taskDaoJpa.findAllById(tasks, project).stream()
                        .filter(t -> t != null)
                        .map(t -> (com.bulletjournal.repository.models.Task) t)
                        .collect(Collectors.toList());
        if (taskList.isEmpty()) {
            return getTasks(projectId, null, null, null, null, null);
        }

        this.taskRepository.deleteInBatch(taskList);

        List<String> deleteESDocumentIds = ESUtil.getProjectItemSearchIndexIds(tasks, ContentType.TASK);
        this.notificationService.deleteESDocument(new RemoveElasticsearchDocumentEvent(deleteESDocumentIds));

        for (com.bulletjournal.repository.models.Task task : taskList) {
            this.notificationService.trackActivity(
                    new Auditable(projectId, "deleted Task ##" + task.getName() +
                            "## in BuJo ##" + project.getName() + "##", username,
                            task.getId(), Timestamp.from(Instant.now()), ContentAction.DELETE_TASK));
        }
        return getTasks(projectId, null, null, null, null, null);
    }

    @DeleteMapping(COMPLETED_TASK_ROUTE)
    public List<Task> deleteCompletedTask(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Task task = getCompletedTask(taskId);
        List<Event> events = this.taskDaoJpa.deleteCompletedTask(username, taskId);
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveTaskEvent(events, username));
        }
        return getCompletedTasks(task.getProjectId(), 0, 50, null, null, null, null);
    }

    @PutMapping(TASK_SET_LABELS_ROUTE)
    public Task setLabels(@NotNull @PathVariable Long taskId, @NotNull @RequestBody List<Long> labels) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.notificationService.inform(this.taskDaoJpa.setLabels(username, taskId, labels));
        return getTask(taskId);
    }

    @PostMapping(MOVE_TASK_ROUTE)
    public void moveTask(@NotNull @PathVariable Long taskId,
            @NotNull @RequestBody MoveProjectItemParams moveProjectItemParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Pair<com.bulletjournal.repository.models.Task, com.bulletjournal.repository.models.Project> res = this.taskDaoJpa
                .move(username, taskId, moveProjectItemParams.getTargetProject());
        com.bulletjournal.repository.models.Task task = res.getLeft();
        com.bulletjournal.repository.models.Project targetProject = res.getRight();
        this.notificationService.trackActivity(new Auditable(task.getProject().getId(),
                "moved Task ##" + task.getName() + "## to BuJo ##" + targetProject.getName() + "##", username,
                task.getId(), Timestamp.from(Instant.now()), ContentAction.MOVE_TASK));
    }

    @PostMapping(SHARE_TASK_ROUTE)
    public SharableLink shareTask(@NotNull @PathVariable Long taskId,
            @NotNull @RequestBody ShareProjectItemParams shareProjectItemParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        if (shareProjectItemParams.isGenerateLink()) {
            return this.taskDaoJpa.generatePublicItemLink(taskId, username, shareProjectItemParams.getTtl());
        }

        Informed inform = this.taskDaoJpa.shareProjectItem(taskId, shareProjectItemParams, username);
        this.notificationService.inform(inform);
        return null;
    }

    @GetMapping(GET_SHARABLES_ROUTE)
    public ProjectItemSharables getSharables(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        ProjectItemSharables result = this.taskDaoJpa.getSharables(taskId, username);
        List<User> users = result.getUsers().stream().map((u) -> this.userClient.getUser(u.getName()))
                .collect(Collectors.toList());
        result.setUsers(users);
        return result;
    }

    @PostMapping(REVOKE_SHARABLE_ROUTE)
    public void revokeSharable(@NotNull @PathVariable Long taskId,
            @NotNull @RequestBody RevokeProjectItemSharableParams revokeProjectItemSharableParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.taskDaoJpa.revokeSharable(taskId, username, revokeProjectItemSharableParams);
    }

    @PostMapping(REMOVE_SHARED_ROUTE)
    public void removeShared(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.taskDaoJpa.removeShared(taskId, username);
    }
    @PostMapping(ADD_CONTENT_ROUTE)
    public Content addContent(@NotNull @PathVariable Long taskId,
            @NotNull @RequestBody CreateContentParams createContentParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        Pair<ContentModel, ProjectItemModel> res = this.taskDaoJpa.addContent(taskId, username,
                new TaskContent(createContentParams.getText()));

        Content createdContent = res.getLeft().toPresentationModel();
        String taskName = res.getRight().getName();
        Long projectId = res.getRight().getProject().getId();
        String projectName = res.getRight().getProject().getName();

        this.notificationService.trackActivity(
                new Auditable(projectId, "created Content in Task ##" + taskName + "## in BuJo ##" + projectName + "##",
                        username, taskId, Timestamp.from(Instant.now()), ContentAction.ADD_TASK_CONTENT));

        return createdContent;
    }

    @GetMapping(CONTENTS_ROUTE)
    public List<Content> getContents(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return Content.addOwnerAvatar(this.taskDaoJpa.getContents(taskId, username).stream()
                .map(t -> t.toPresentationModel()).collect(Collectors.toList()), this.userClient);
    }

    @GetMapping(COMPLETED_TASK_CONTENTS_ROUTE)
    public List<Content> getCompletedTaskContents(@NotNull @PathVariable Long taskId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return Content.addOwnerAvatar(this.taskDaoJpa.getCompletedTaskContents(taskId, username).stream()
                .map(t -> t.toPresentationModel()).collect(Collectors.toList()), this.userClient);
    }

    @DeleteMapping(CONTENT_ROUTE)
    public List<Content> deleteContent(@NotNull @PathVariable Long taskId, @NotNull @PathVariable Long contentId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<String> deleteESDocumentIds = this.taskDaoJpa.getDeleteESDocumentIdsForContent(username, contentId);
        ProjectItemModel task = this.taskDaoJpa.deleteContent(contentId, taskId, username);

        this.notificationService.trackActivity(new Auditable(task.getProject().getId(),
                "Deleted Content in Task ##" + task.getName() + "## under BuJo ##" + task.getProject().getName() + "##",
                username, taskId, Timestamp.from(Instant.now()), ContentAction.DELETE_TASK_CONTENT));
        this.notificationService.deleteESDocument(new RemoveElasticsearchDocumentEvent(deleteESDocumentIds));

        return getContents(taskId);
    }

    @PatchMapping(CONTENT_ROUTE)
    public List<Content> updateContent(@NotNull @PathVariable Long taskId, @NotNull @PathVariable Long contentId,
            @NotNull @RequestBody UpdateContentParams updateContentParams, @RequestHeader(IF_NONE_MATCH) Optional<String> etag) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        ProjectItemModel task = this.taskDaoJpa.updateContent(contentId, taskId, username, updateContentParams, etag)
                .getRight();

        this.notificationService.trackActivity(new Auditable(task.getProject().getId(),
                "updated Content in Task ##" + task.getName() + "## under BuJo ##" + task.getProject().getName() + "##",
                username, taskId, Timestamp.from(Instant.now()), ContentAction.UPDATE_TASK_CONTENT));

        return getContents(taskId);
    }

    @GetMapping(CONTENT_REVISIONS_ROUTE)
    public Revision getContentRevision(@NotNull @PathVariable Long taskId, @NotNull @PathVariable Long contentId,
            @NotNull @PathVariable Long revisionId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Revision revision = this.taskDaoJpa.getContentRevision(username, taskId, contentId, revisionId);
        return Revision.addAvatar(revision, this.userClient);
    }

    @GetMapping(TASK_STATISTICS_ROUTE)
    public TaskStatistics getTaskStatistics(
            @NotNull @RequestParam List<Long> projectIds,
            @NotBlank @RequestParam String timezone,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // e.g. http://localhost:8080/api/taskStatistics?projectIds=11&projectIds=12&timezone=America%2FLos_Angeles&startDate=2020-01-01&endDate=2020-09-10
        String username = MDC.get(UserClient.USER_NAME_KEY);

        // validate all projects user can access
        Set<Long> userProjects = this.projectDaoJpa.getUserProjects(username)
                .stream().map(p -> p.getId()).collect(Collectors.toSet());
        // UnAuthorizedException
        projectIds.forEach(id -> {
            if (!userProjects.contains(id)) {
                throw new UnAuthorizedException("UnAuthorized to access the given projects");
            }
        });

        // startDate != null && endDate != null => include only tasks with due date/time
        // startDate != null && endDate == null => include tasks without due date/time
        // startDate == null && endDate == null => include tasks without due date/time
        // startDate == null && endDate != null => include only tasks with due date/time
        List<com.bulletjournal.repository.models.CompletedTask> completedTasks = taskDaoJpa.getCompletedTaskByProjectIdInTimePeriod(projectIds, startDate, endDate, timezone);
        List<com.bulletjournal.repository.models.Task> uncompletedTasks = taskDaoJpa.getUncompletedTasksByProjectIdInTimePeriod(projectIds, startDate, endDate, timezone);
        return calculateTaskStatistics(completedTasks, uncompletedTasks);
    }

    private TaskStatistics calculateTaskStatistics(
            List<CompletedTask> completedTasks, List<com.bulletjournal.repository.models.Task> uncompletedTasks) {
        TaskStatistics taskStatistics = new TaskStatistics();
        taskStatistics.setCompleted(completedTasks.size());
        taskStatistics.setUncompleted(uncompletedTasks.size());
        Map<String, UserTaskStatistic> userToTasks = new HashMap<>();
        completedTasks.forEach(task ->
                task.getAssignees().forEach(
                        assignee -> userToTasks.computeIfAbsent(assignee,
                                k -> new UserTaskStatistic(this.userClient.getUser(assignee))).incrementCompleted()));

        uncompletedTasks.forEach(
                task -> task.getAssignees().forEach(
                        assignee -> userToTasks.computeIfAbsent(assignee,
                                k -> new UserTaskStatistic(this.userClient.getUser(assignee))).incrementUncompleted()));
        List<UserTaskStatistic> userTaskStatisticList = userToTasks.values().stream().collect(Collectors.toList());
        userTaskStatisticList.sort((user1TaskStatistic, user2TaskStatistic) -> {
            int percentage1 = user1TaskStatistic.getCompleted() * 100 / (user1TaskStatistic.getCompleted() + user1TaskStatistic.getUncompleted());
            int percentage2 = user2TaskStatistic.getCompleted() * 100 / (user2TaskStatistic.getCompleted() + user2TaskStatistic.getUncompleted());
            if (percentage1 != percentage2) {
                return percentage1 - percentage2;
            }
            return user1TaskStatistic.getUser().getName().compareTo(user2TaskStatistic.getUser().getName());
        });
        taskStatistics.setUserTaskStatistics(userTaskStatisticList);
        return taskStatistics;
    }

    @PostMapping(REVISION_CONTENT_ROUTE)
    public Content patchRevisionContents(@NotNull @PathVariable Long taskId,
                                      @NotNull @PathVariable Long contentId,
                                      @NotNull @RequestBody  RevisionContentsParams revisionContentsParams,
                                      @RequestHeader(IF_NONE_MATCH) String etag) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        TaskContent content = this.taskDaoJpa.patchRevisionContentHistory(
                contentId, taskId, username, revisionContentsParams.getRevisionContents(), etag);
        return content == null ? new Content() : content.toPresentationModel();
    }
}