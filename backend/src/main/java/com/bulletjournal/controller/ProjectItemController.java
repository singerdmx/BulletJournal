package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.ProjectItem;
import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.*;
import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.Transaction;
import com.bulletjournal.repository.models.User;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.*;

@RestController
public class ProjectItemController {

    public static final String RECENT_ITEMS_ROUTE = "/api/recentItems";
    protected static final String PROJECT_ITEMS_ROUTE = "/api/projectItems";
    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private TransactionDaoJpa transactionDaoJpa;

    @Autowired
    private NoteDaoJpa noteDaoJpa;

    @Autowired
    private LabelDaoJpa labelDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserAliasDaoJpa userAliasDaoJpa;

    @Autowired
    private UserClient userClient;

    @GetMapping(PROJECT_ITEMS_ROUTE)
    @ResponseBody
    public List<ProjectItems> getProjectItems(
            @Valid @RequestParam List<ProjectType> types,
            @NotBlank @RequestParam String startDate,
            @NotBlank @RequestParam String endDate,
            @NotBlank @RequestParam String timezone) {

        if (types.isEmpty()) {
            return Collections.emptyList();
        }

        String username = MDC.get(UserClient.USER_NAME_KEY);

        // Set start time and end time
        ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
        ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);

        Map<ZonedDateTime, ProjectItems> projectItemsMap =
                getZonedDateTimeProjectItemsMap(types, username, startTime, endTime);
        List<ProjectItems> projectItems = ProjectItemsGrouper.getSortedProjectItems(projectItemsMap);
        return ProjectItems.addOwnerAvatar(
                this.labelDaoJpa.getLabelsForProjectItems(projectItems),
                this.userClient);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    protected Map<ZonedDateTime, ProjectItems> getZonedDateTimeProjectItemsMap(
            List<ProjectType> types, String username, ZonedDateTime startTime, ZonedDateTime endTime) {

        Map<ZonedDateTime, List<Task>> taskMap = null;
        Map<ZonedDateTime, List<Transaction>> transactionMap = null;
        User user = this.userDaoJpa.getByName(username);

        // Task query
        if (types.contains(ProjectType.TODO)) {
            List<Task> tasks = taskDaoJpa.getTasksBetween(user.getName(), startTime, endTime);
            // Group tasks by date
            taskMap = ProjectItemsGrouper.groupTasksByDate(tasks, false);
        }
        // Ledger query
        if (types.contains(ProjectType.LEDGER)) {
            List<Transaction> transactions = transactionDaoJpa.getTransactionsBetween(user.getName(), startTime, endTime);
            // Group transaction by date
            transactionMap = ProjectItemsGrouper.groupTransactionsByDate(transactions);
        }

        Map<ZonedDateTime, ProjectItems> projectItemsMap = new HashMap<>();
        projectItemsMap = ProjectItemsGrouper.mergeTasksMap(projectItemsMap, taskMap, userAliasDaoJpa.getAliases(username));
        projectItemsMap = ProjectItemsGrouper.mergeTransactionsMap(projectItemsMap, transactionMap);

        return projectItemsMap;
    }

    @GetMapping(RECENT_ITEMS_ROUTE)
    @ResponseBody
    public List<ProjectItem> getRecentProjectItems(
            @Valid @RequestParam List<ProjectType> types,
            @NotBlank @RequestParam String startDate,
            @NotBlank @RequestParam String endDate,
            @NotBlank @RequestParam String timezone) {

        if (types.isEmpty()) {
            return Collections.emptyList();
        }

        Timestamp startTime = Timestamp.from(ZonedDateTimeHelper.getStartTime(startDate, null, timezone).toInstant());
        Timestamp endTime = Timestamp.from(ZonedDateTimeHelper.getStartTime(endDate, null, timezone).toInstant());
        List<ProjectItem> projectItems = new LinkedList<>();
        String username = MDC.get(UserClient.USER_NAME_KEY);

        if (types.contains(ProjectType.TODO)) {
            List<Task> tasks = taskDaoJpa.getRecentTasksBetween(startTime, endTime);
            if (!tasks.isEmpty()) {
                Map<String, String> aliases = userAliasDaoJpa.getAliases(username);
                projectItems.addAll(ProjectItemsGrouper.addLabelsToTasks(tasks, aliases));
            }
        }
        if (types.contains(ProjectType.LEDGER)) {
            List<Transaction> transactions = transactionDaoJpa.getRecentTransactionsBetween(startTime, endTime);
            projectItems.addAll(ProjectItemsGrouper.addLabelsToTransactions(transactions));
        }
        if (types.contains(ProjectType.NOTE)) {
            List<Note> notes = noteDaoJpa.getRecentNotesBetween(startTime, endTime);
            projectItems.addAll(ProjectItemsGrouper.addLabelsToNotes(notes));
        }

        projectItems = this.labelDaoJpa.getLabelsForProjectItemList(projectItems);
        projectItems.sort((t1, t2) -> t2.getUpdatedAt().compareTo(t1.getUpdatedAt()));

        return projectItems;
    }
}
