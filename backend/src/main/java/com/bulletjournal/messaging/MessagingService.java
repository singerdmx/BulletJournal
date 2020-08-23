package com.bulletjournal.messaging;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.messaging.firebase.FcmClient;
import com.bulletjournal.messaging.firebase.FcmMessageParams;
import com.bulletjournal.messaging.mailjet.MailjetEmailClient;
import com.bulletjournal.messaging.mailjet.MailjetEmailParams;
import com.bulletjournal.repository.DeviceTokenDaoJpa;
import com.bulletjournal.repository.UserAliasDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.DeviceToken;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.User;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.json.JSONArray;
import org.json.JSONObject;
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

    public static final String NONE_STRING = "None";

    public static final String ALIAS_PROPERTY = "alias";

    public static final String AVATAR_PROPERTY = "avatar";

    public static final String ASSIGNEES_PROPERTY = "assignees";

    public static final String TASK_NAME_PROPERTY = "taskName";

    public static final String TIMESTAMP_PROPERTY = "timestamp";

    public static final String TASK_URL_PROPERTY = "taskUrl";

    public static final String BASE_TASK_URL = "https://bulletjournal.us/#/task/";

    private FcmClient fcmClient;

    private MailjetEmailClient mailjetClient;

    private DeviceTokenDaoJpa deviceTokenDaoJpa;

    private UserDaoJpa userDaoJpa;

    private UserAliasDaoJpa userAliasDaoJpa;

    private UserClient userClient;

    @Autowired
    public MessagingService(
        FcmClient fcmClient,
        MailjetEmailClient mailjetClient,
        DeviceTokenDaoJpa deviceTokenDaoJpa,
        UserDaoJpa userDaoJpa,
        UserAliasDaoJpa userAliasDaoJpa,
        UserClient userClient
    ) {
        this.fcmClient = fcmClient;
        this.mailjetClient = mailjetClient;
        this.deviceTokenDaoJpa = deviceTokenDaoJpa;
        this.userDaoJpa = userDaoJpa;
        this.userAliasDaoJpa = userAliasDaoJpa;
        this.userClient = userClient;
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
                emailParamsList.addAll(createEmailParamsForDueTask(task, nameEmailMap));
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
        return taskName + " due at " + getDueTime(task);
    }

    private String getDueTime(Task task) {
        StringBuilder ret = new StringBuilder(task.getDueDate());
        if (StringUtils.isNotBlank(task.getDueTime())) {
            ret.append(" " + task.getDueTime());
        }
        ret.append(" (" + task.getTimezone() + ")");
        return ret.toString();
    }

    private List<MailjetEmailParams> createEmailParamsForDueTask(
        Task task, Map<String, String> nameEmailMap
    ) {
        List<MailjetEmailParams> ret = new ArrayList<>();
        List<String> assignees = task.getAssignees();
        Map<String, Map<String, String>> aliasMap = getAliasMap(assignees);
        Map<String, String> avatarMap = getAvatarMap(assignees);
        String taskUrl = BASE_TASK_URL + task.getId();
        for (String receiver : assignees) {
            MailjetEmailParams params =
                new MailjetEmailParams(
                    Arrays.asList(new ImmutablePair<>(receiver, nameEmailMap.get(receiver))),
                    getTitle(task),
                    null,
                    MailjetEmailClient.Template.TASK_DUE_NOTIFICATION,
                    TASK_NAME_PROPERTY,
                    task.getName(),
                    TIMESTAMP_PROPERTY,
                    getDueTime(task),
                    TASK_URL_PROPERTY,
                    taskUrl
                );
            JSONArray assigneeInfoList = new JSONArray();
            JSONObject selfInfo = new JSONObject();
            selfInfo.put(ALIAS_PROPERTY, receiver);
            selfInfo.put(AVATAR_PROPERTY, avatarMap.getOrDefault(receiver, NONE_STRING));
            assigneeInfoList.put(selfInfo);
            for (String otherName : assignees) {
                if (otherName.equals(receiver)) {
                    continue;
                }
                String alias = aliasMap.get(receiver).getOrDefault(otherName, otherName);
                String avator = avatarMap.getOrDefault(otherName, NONE_STRING);
                JSONObject obj = new JSONObject();
                obj.put(ALIAS_PROPERTY, alias);
                obj.put(AVATAR_PROPERTY, avator);
                assigneeInfoList.put(obj);
            }
            params.addKv(ASSIGNEES_PROPERTY, assigneeInfoList);
            ret.add(params);
        }
        return ret;
    }

    private Map<String, String> getAvatarMap(List<String> usernames) {
        Map<String, String> ret = new HashMap<>();
        for (String username : usernames) {
            com.bulletjournal.controller.models.User user = userClient.getUser(username);
            if (user.getAvatar() != null) {
                ret.put(username, user.getAvatar());
            }
        }
        return ret;
    }

    /**
     * get (baseUser, targetUsername, targetUserAlias) map for each user
     */
    private Map<String, Map<String, String>> getAliasMap(List<String> usernames) {
        Map<String, Map<String, String>> ret = new HashMap<>();
        for (String username : usernames) {
            ret.put(username, userAliasDaoJpa.getAliases(username));
        }
        return ret;
    }
}
