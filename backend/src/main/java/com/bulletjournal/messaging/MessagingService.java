package com.bulletjournal.messaging;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.messaging.firebase.FcmClient;
import com.bulletjournal.messaging.firebase.FcmMessageParams;
import com.bulletjournal.messaging.mailjet.MailjetEmailClient;
import com.bulletjournal.messaging.mailjet.MailjetEmailClient.Template;
import com.bulletjournal.messaging.mailjet.MailjetEmailParams;
import com.bulletjournal.repository.DeviceTokenDaoJpa;
import com.bulletjournal.repository.UserAliasDaoJpa;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.DeviceToken;
import com.bulletjournal.repository.models.Notification;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.User;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public static final String TASK_OWNER_PROPERTY = "owner_name";

    public static final String TASK_OWNER_AVATAR_PROPERTY = "owner_avatar";

    public static final String CLICK_ACTION_KEY = "click_action";

    private static final String CLICK_ACTION_VALUE = "FLUTTER_NOTIFICATION_CLICK";

    private FcmClient fcmClient;

    private MailjetEmailClient mailjetClient;

    private DeviceTokenDaoJpa deviceTokenDaoJpa;

    private UserDaoJpa userDaoJpa;

    private UserAliasDaoJpa userAliasDaoJpa;

    private UserClient userClient;

    // JOIN GROUP PROPERTIES
    private static final String GROUP_INVITATION_BASE_URL =
        "http://bulletjournal.us/public/notifications/";

    private static final String GROUP_INVITATION_ACCEPT_SUFFIX = "?action=accept";

    private static final String GROUP_INVITATION_DECLINE_SUFFIX = "?action=decline";

    private static final String GROUP_INVITATION_ACCEPT_URL_PROPERTY = "groupInvitationAcceptURL";

    private static final String GROUP_INVITATION_DECLINE_URL_PROPERTY = "groupInvitationDeclineURL";

    private static final String GROUP_INVITER_PROPERTY = "groupInviter";

    private static final String GROUP_INVITER_AVATAR_PROPERTY = "groupInviterAvatar";

    private static final String GROUP_NAME_PROPERTY = "groupName";

    // APP INVITATION PROPERTIES
    private static final String APP_BASIC_URL = "https://bulletjournal.us/home/index.html";

    private static final String APP_URL_PROPERTY = "appUrl";

    private static final String APP_INVITER_PROPERTY = "appInviter";

    private static final String APP_INVITER_AVATAR_PROPERTY = "appInviterAvatar";

    // Regex Pattern
    private static final Pattern EMAIL_PATTERN = Pattern
        .compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", Pattern.CASE_INSENSITIVE);

    private static final Pattern GROUP_INVITATION_TITLE_PATTERN =  Pattern
        .compile("(?s)(?<=##).*?(?=##)");


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
            .map(token -> new FcmMessageParams(token.getToken(), "type", "Notification", CLICK_ACTION_KEY, CLICK_ACTION_VALUE))
            .collect(Collectors.toList());
        fcmClient.sendAllMessagesAsync(params);
    }

    public void sendJoinGroupNotificationEmailsToUser(
        List<Pair<String, Notification>> notificationWithUIDs) {
        LOGGER.info("Sending join group notifications ...");
        try {
            Set<String> distinctTargetUsers = notificationWithUIDs.stream().flatMap(item ->
                Stream.of(item.getValue().getTargetUser()))
                .collect(Collectors.toSet());
            List<User> targetUsers = userDaoJpa.getUsersByNames(distinctTargetUsers);
            Map<String, String> targetUserEmailMap = new HashMap<>();
            for (User user : targetUsers) {
                if (user.getEmail() != null && !user.getEmail().endsWith("@anon.1o24bbs.com")) {
                    targetUserEmailMap.put(user.getName(), user.getEmail());
                }
            }

            Set<String> distinctInviters = notificationWithUIDs.stream().flatMap(item ->
                Stream.of(item.getValue().getOriginator()))
                .collect(Collectors.toSet());
            Map<String, String> inviterAvatarMap = getAvatarMap(new ArrayList<>(distinctInviters));

            List<MailjetEmailParams> emailParamsList = new ArrayList<>();
            for (Pair<String, Notification> notificationWithUID : notificationWithUIDs) {
                MailjetEmailParams mailjetEmailParams =
                    createEmailParamsForGroupInvitation(notificationWithUID,
                        targetUserEmailMap, inviterAvatarMap);
                if (mailjetEmailParams != null) {
                    emailParamsList.add(mailjetEmailParams);
                }
            }
            mailjetClient.sendAllEmailAsync(emailParamsList);
        } catch (Exception e) {
            LOGGER.error("sendJoinGroupNotificationEmailsToUser failed", e);
        }
    }

    public void sendTaskDueNotificationAndEmailToUsers(List<Task> taskList) {
        LOGGER.info("Sending task due notification for tasks: {}", taskList);
        try {
            taskList = taskList.stream().filter((task -> {
                if (task.getAssignees().isEmpty()) {
                    LOGGER.error("Task id: {} has empty assignee list", task.getId());
                    return false;
                }
                return true;
            })).collect(Collectors.toList());
            if (taskList.isEmpty()) {
                return;
            }
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
                String.valueOf(task.getId()),
                CLICK_ACTION_KEY,
                CLICK_ACTION_VALUE
            ));
        }
        return paramsList;
    }

    public void sendAppInvitationEmailsToUser(String inviter, List<String> emails) {
        LOGGER.info("Sending app invitation emails...");
        try {
            List<MailjetEmailParams> emailParamsList = new ArrayList<>();
            for (String email : new HashSet<>(emails)) {
                MailjetEmailParams mailjetEmailParams =
                    createEmailPramsForAppInvitation(inviter, this.getAvatar(inviter), email);
                if (mailjetEmailParams != null) {
                    emailParamsList.add(mailjetEmailParams);
                }
            }
            mailjetClient.sendAllEmailAsync(emailParamsList);
        } catch (Exception e) {
            LOGGER.error("sendAppInvitationEmailsToUser failed", e);
        }
    }

    public MailjetEmailParams createEmailPramsForAppInvitation(String inviter,
                                                               String inviterAvatar,
                                                               String email) {
        if (!this.isValidEmailAddr(email)) {
          LOGGER.error("Invalid app invitation email address: {}", email);
          return null;
        }

        if (inviter == null || inviterAvatar == null) {
          LOGGER.error("APP Invitation: Invalid inviter infor");
          return null;
        }

        String title = inviter + " invited your to join BulletJournal";

        return new MailjetEmailParams(
            Arrays.asList(new ImmutablePair(null, email)),
            title,
            null,
            Template.APP_INVITATION,
            APP_URL_PROPERTY,
            APP_BASIC_URL,
            APP_INVITER_PROPERTY,
            inviter,
            APP_INVITER_AVATAR_PROPERTY,
            inviterAvatar
        );
    }

    private boolean isValidEmailAddr(String email) {
        Matcher emailMatcher = EMAIL_PATTERN.matcher(email);
        return emailMatcher.find();
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

    private MailjetEmailParams createEmailParamsForGroupInvitation(
        Pair<String, Notification> notificationWithUID, Map<String, String> targetUserEmailMap,
        Map<String, String> inviterAvatarMap
    ) {
        Notification notification = notificationWithUID.getValue();
        String receiver = notification.getTargetUser();
        String inviter = notification.getOriginator();
        String title = notification.getTitle();
        String uid = notificationWithUID.getKey();
        Matcher titleMatcher = GROUP_INVITATION_TITLE_PATTERN.matcher(title);
        List<String> matchResults = new ArrayList<>();
        String groupInviterAvatar = inviterAvatarMap.get(inviter);
        while (titleMatcher.find()) {
            matchResults.add(titleMatcher.group());
        }

        // invalid msg format. no GROUP NAME found.
        if (matchResults.size() != 3) {
            LOGGER.error("Invalid group invitation message format {}. No group name found.", title);
            return null;
        }

        return new MailjetEmailParams(
                Arrays.asList(new ImmutablePair<>(receiver, targetUserEmailMap.get(receiver))),
                title.replace("#", ""),
                null,
                Template.JOIN_GROUP_NOTIFICATION,
                GROUP_INVITATION_ACCEPT_URL_PROPERTY,
                GROUP_INVITATION_BASE_URL + uid + GROUP_INVITATION_ACCEPT_SUFFIX,
                GROUP_INVITATION_DECLINE_URL_PROPERTY,
                GROUP_INVITATION_BASE_URL + uid + GROUP_INVITATION_DECLINE_SUFFIX,
                GROUP_INVITER_PROPERTY,
                inviter,
                GROUP_NAME_PROPERTY,
                matchResults.get(2),
                GROUP_INVITER_AVATAR_PROPERTY,
                groupInviterAvatar
            );
    }


    private List<MailjetEmailParams> createEmailParamsForDueTask(
        Task task, Map<String, String> nameEmailMap
    ) {
        List<MailjetEmailParams> ret = new ArrayList<>();
        List<String> assignees = task.getAssignees();
        Map<String, Map<String, String>> aliasMap = getAliasMap(assignees);
        Map<String, String> avatarMap = getAvatarMap(assignees);
        String taskUrl = BASE_TASK_URL + task.getId();
        String ownerName = task.getOwner();
        String ownerAvatar = getAvatar(ownerName);
        for (String receiver : assignees) {
            if (!nameEmailMap.containsKey(receiver)) {
                continue;
            }
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
                    taskUrl,
                    TASK_OWNER_PROPERTY,
                    ownerName,
                    TASK_OWNER_AVATAR_PROPERTY,
                    ownerAvatar
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
            ret.put(username, getAvatar(username));
        }
        return ret;
    }

    private String getAvatar(String username) {
        com.bulletjournal.controller.models.User user = userClient.getUser(username);
        if (user.getAvatar() != null) {
            return user.getAvatar();
        }
        return NONE_STRING;
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
