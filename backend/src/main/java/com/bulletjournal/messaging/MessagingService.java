package com.bulletjournal.messaging;

import com.bulletjournal.messaging.firebase.FcmClient;
import com.bulletjournal.messaging.firebase.FcmMessageParams;
import com.bulletjournal.messaging.mailjet.MailjetEmailClient;
import com.bulletjournal.messaging.mailjet.MailjetEmailParams;
import com.bulletjournal.repository.DeviceTokenDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.DeviceToken;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.User;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Handle mobile device notification and email service
 */
@Service
public class MessagingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessagingService.class);

    private FcmClient fcmClient;

    private MailjetEmailClient mailjetClient;

    private DeviceTokenDaoJpa deviceTokenDaoJpa;

    private UserDaoJpa userDaoJpa;

    @Autowired
    public MessagingService(
        FcmClient fcmClient,
        MailjetEmailClient mailjetClient,
        DeviceTokenDaoJpa deviceTokenDaoJpa,
        UserDaoJpa userDaoJpa
    ) {
        this.fcmClient = fcmClient;
        this.mailjetClient = mailjetClient;
        this.deviceTokenDaoJpa = deviceTokenDaoJpa;
        this.userDaoJpa = userDaoJpa;
    }

    public void sendEtagUpdateNotificationToUsers(Collection<String> usernames) {
        LOGGER.info("Sending notification to users: {}", usernames);
        List<DeviceToken> deviceTokens = deviceTokenDaoJpa.getTokensByUsers(usernames);
        List<FcmMessageParams> params = deviceTokens.stream()
            .map(token -> new FcmMessageParams(token.getToken(), "type", "Notification"))
            .collect(Collectors.toList());
        fcmClient.sendAllMessagesAsync(params);
    }

    public void sendTaskDueNotificationAndEmailToUsers(List<Task> taskList) {
        LOGGER.info("Sending task due notification for tasks: {}", taskList);
        try {
            Set<String> distinctUsers = taskList.stream()
                .flatMap(task -> task.getAssignees().stream())
                .collect(Collectors.toSet());
            List<DeviceToken> tokens = deviceTokenDaoJpa.getTokensByUsers(distinctUsers);
            List<User> users = userDaoJpa.getUsersByNames(distinctUsers);
            Map<String, List<String>> nameTokensMap = new HashMap<>();
            for (DeviceToken deviceToken : tokens) {
                if (!nameTokensMap.containsKey(deviceToken.getUsername())) {
                    nameTokensMap.put(deviceToken.getUsername(), new ArrayList<>());
                }
                nameTokensMap.get(deviceToken.getUsername()).add(deviceToken.getToken());
            }
            Map<String, String> nameEmailMap = new HashMap<>();
            for (User user : users) {
                if (user.getEmail() != null && !user.getEmail().endsWith("@anon.1o24bbs.com")) {
                    nameEmailMap.put(user.getName(), user.getEmail());
                }
            }

            LOGGER.info("Name email map: {}", nameEmailMap);
            LOGGER.info("Name token map: {}", nameTokensMap);
            List<MailjetEmailParams> emailParamsList = new ArrayList<>();
            List<FcmMessageParams> messageParamsList = new ArrayList<>();
            for (Task task : taskList) {
                messageParamsList.addAll(createFcmMessageParamsListFromDueTask(task, nameTokensMap));
                emailParamsList.add(createEmailParamsForDueTask(task, nameEmailMap));
            }
            fcmClient.sendAllMessagesAsync(messageParamsList);
            mailjetClient.sendAllEmailAsync(emailParamsList);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private List<FcmMessageParams> createFcmMessageParamsListFromDueTask(
        Task task, Map<String, List<String>> nameTokenMap
    ) {
        List<FcmMessageParams> paramsList = new ArrayList<>();
        List<String> targetTokens = new ArrayList<>();
        for (String username : task.getAssignees()) {
            List<String> tokenList = nameTokenMap.get(username);
            if (tokenList != null) {
                targetTokens.addAll(nameTokenMap.get(username));
            } else {
                LOGGER.info("user {} doesn't have device token", username);
            }
        }

        Pair<String, String> notificationTitleBody
            = new ImmutablePair<>(getTitle(task), "");
        for (String token : targetTokens) {
            paramsList.add(new FcmMessageParams(
                token,
                notificationTitleBody,
                "type",
                "taskDueNotification",
                "taskId",
                String.valueOf(task.getId())
            ));
        }
        return paramsList;
    }

    private String getTitle(Task task) {
        String taskName = task.getName();
        String dueDate = task.getDueDate();
        String dueTime = task.getDueTime();
        StringBuilder res = new StringBuilder(taskName + " due at " + dueDate);
        if (StringUtils.isNotBlank(dueTime)) {
            res.append(" " + dueTime);
        }
        res.append(" (" + task.getTimezone() + ")");
        return res.toString();
    }

    private MailjetEmailParams createEmailParamsForDueTask(
        Task task, Map<String, String> nameEmailMap
    ) {
        List<Pair<String, String>> receivers = new ArrayList<>();
        for (String username: task.getAssignees()) {
            String email = nameEmailMap.get(username);
            receivers.add(new ImmutablePair<>(username, email));
        }
        MailjetEmailParams params =
            new MailjetEmailParams(
                receivers,
                getTitle(task),
                getTitle(task)
            );
        return params;
    }
}
