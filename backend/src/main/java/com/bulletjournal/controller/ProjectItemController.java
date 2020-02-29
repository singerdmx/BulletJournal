package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.utils.IntervalHelper;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.TransactionDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class ProjectItemController {

    protected static final String PROJECT_ITEMS_ROUTE = "/api/projectItems";

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private TransactionDaoJpa transactionDaoJpa;

    @GetMapping(PROJECT_ITEMS_ROUTE)
    public List<ProjectItems> getProjectItems(
            @Valid @RequestParam List<ProjectType> types,
            @NotBlank @RequestParam String timezone) {
        return null;
    }

    @GetMapping(PROJECT_ITEMS_ROUTE)
    public List<ProjectItems> getProjectItemsByInterval(
            @Valid @RequestParam List<ProjectType> types,
            @NotBlank @RequestParam String date,
            @RequestParam Optional<String> time,
            @NotBlank @RequestParam String timezone) {

        List<ProjectItems> projectItems = new ArrayList<>();

        String username = MDC.get(UserClient.USER_NAME_KEY);
        ZonedDateTime startTime = IntervalHelper.getStartTime(date, time.orElseGet(() -> {
            return null;
        }), timezone);
        ZonedDateTime endTime = IntervalHelper.getEndTime(date, time.orElseGet(() -> {
            return null;
        }), timezone);

        for (ProjectType projectType : types) {
            switch (projectType.getValue()) {
                case 0: // Task
                    break;
                case 2: // Ledger
                    ProjectItems projectItem = new ProjectItems();
                    projectItem.setTransactions(transactionDaoJpa.
                            findTransactionsByInterval(username, startTime, endTime));
                    projectItems.add(projectItem);
                    break;
                default:
            }
        }
        return projectItems;
    }
}
