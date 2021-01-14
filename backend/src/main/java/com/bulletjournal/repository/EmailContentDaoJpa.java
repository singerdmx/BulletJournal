package com.bulletjournal.repository;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.NoteContent;
import com.bulletjournal.repository.models.TaskContent;
import com.bulletjournal.repository.models.User;
import com.google.common.collect.ImmutableList;

import java.util.*;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class EmailContentDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailContentDaoJpa.class);
    private static final Gson GSON = new Gson();
    private static final String HTML_CONTENT_KEY = "###html###";
    private static final String CONTENT_TYPE_TASK = "task";
    private static final String CONTENT_TYPE_NOTE = "note";
    private static final String CONTENT_TYPE_TRANSACTION = "transaction";

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private NoteContentRepository noteContentRepository;

    @Autowired
    private NoteDaoJpa noteDaoJpa;

    @Autowired
    private TaskContentRepository taskContentRepository;

    @Autowired
    private GroupRepository groupRepository;

    /**
     * Send content by given usernames
     *
     * @param contentType     content type - task, note, transaction
     * @param contentParentId task id / note id / transaction id
     * @param usernames       target usernames
     */
    public void sendContentsByUsernames(String contentType, Long contentParentId, List<String> usernames) {
        List<String> htmlContents = getHTMLContents(contentType, contentParentId);
        if (htmlContents.size() != 0) {
            List<String> userEmails = getUserEmails(usernames);
            emailContentByTargetEmails(htmlContents, userEmails);
        }
    }

    /**
     * Send content by given group name
     *
     * @param contentType     content type - task, note, transaction
     * @param contentParentId task id / note id / transaction id
     * @param groupName       target group name
     */
    public void sendContentsByGroupName(String contentType, Long contentParentId, String groupName) {
        List<String> htmlContents = getHTMLContents(contentType, contentParentId);
        if (htmlContents.size() != 0) {
            List<String> userEmails = getGroupUserEmailsExceptRequester(groupName);
            emailContentByTargetEmails(htmlContents, userEmails);
        }
    }

    /**
     * Send content by given email addresses
     *
     * @param contentType     content type - task, note, transaction
     * @param contentParentId task id / note id / transaction id
     * @param targetEmails    target emails
     */
    public void sendContentsByEmails(String contentType, Long contentParentId, List<String> targetEmails) {
        List<String> htmlContents = getHTMLContents(contentType, contentParentId);
        if (htmlContents.size() != 0) {
            emailContentByTargetEmails(htmlContents, targetEmails);
        }
    }

    /**
     * Get HTML format contents
     *
     * @param contentType     content type - task, note, transaction
     * @param contentParentId task id / note id / transaction id
     * @return list of html content string
     * @throws ResourceNotFoundException if content type not found;
     *                                   Or, task/note/transaction id not found under requester name in database
     */
    public List<String> getHTMLContents(String contentType, Long contentParentId) {
        String requester = MDC.get(UserClient.USER_NAME_KEY);
        List<String> baseTexts = null;

        switch (contentType) {
            case CONTENT_TYPE_TASK:
                List<TaskContent> taskContents = taskContentRepository
                        .findAllByTaskIdAndOwner(ImmutableList.of(contentParentId), requester);
                if (taskContents.size() == 0) {
                    LOGGER.error("Unable to find out the task Id " + contentParentId + " under user: " + requester);
                    throw new ResourceNotFoundException("Unable to find out the task Id "
                            + contentParentId + " under user: " + requester);
                }
                baseTexts = taskContents.stream().map(TaskContent::getBaseText).collect(Collectors.toList());
                break;
            case CONTENT_TYPE_NOTE:
                List<NoteContent> noteContents = noteContentRepository
                        .findAllByNoteIdAndOwner(ImmutableList.of(contentParentId), requester);
                if (noteContents.size() == 0) {
                    LOGGER.error("Unable to find out the note Id " + contentParentId + " under user: " + requester);
                    throw new ResourceNotFoundException("Unable to find out the note Id "
                            + contentParentId + " under user: " + requester);
                }
                baseTexts = noteContents.stream().map(NoteContent::getBaseText).collect(Collectors.toList());
                break;
            case CONTENT_TYPE_TRANSACTION:
                System.out.println("?!");
                break;
            default:
                break;
        }

        if (baseTexts == null) {
            LOGGER.error("Unable to find out content type: " + contentType);
            throw new ResourceNotFoundException("Unable to find out content type: " + contentType);
        }
        return getHtmlContentFromBaseText(baseTexts);
    }


    /**
     * Email html format contents to given emails
     *
     * @param htmlContents content in html format
     * @param targetEmails target emails
     *
     * @TODO complete send email part
     */
    public void emailContentByTargetEmails(List<String> htmlContents, List<String> targetEmails) {
        if (htmlContents.size() == 0) {
            return;
        }

        StringBuilder contentBuilder = new StringBuilder();
        for (String htmlContent : htmlContents) {
            contentBuilder.append(htmlContent);
        }

        String content = contentBuilder.toString();

        System.out.println(content);
        System.out.println(targetEmails);
    }

    /**
     * Get user emails by usernames
     *
     * @param usernames target usernames
     * @return target user emails
     */
    public List<String> getUserEmails(List<String> usernames) {
        List<User> targetUsers = userDaoJpa.getUsersByNames(new HashSet<>(usernames));
        List<String> targetUserEmails = new ArrayList<>();
        for (User user : targetUsers) {
            String email = user.getEmail();
            if (email != null) {
                targetUserEmails.add(email);
            }
        }
        return targetUserEmails;
    }

    /**
     * Get all users' emails in given group name
     *
     * @param groupName group name
     * @return all users emails under given group except requester
     */
    public List<String> getGroupUserEmailsExceptRequester(String groupName) {
        String requester = MDC.get(UserClient.USER_NAME_KEY);
        if (groupRepository.findByNameAndOwner(groupName, requester) == null) {
            LOGGER.error("Unable to find out the group name: " + groupName + " under user: " + requester);
            throw new ResourceNotFoundException("Unable to find out the group name: "
                    + groupName + " under user: " + requester);
        }
        List<String> usernamesWithoutRequester = groupRepository
                .findAllOwnerByName(groupName).stream()
                .filter(item -> !item.equals(requester)).collect(Collectors.toList());
        return getUserEmails(usernamesWithoutRequester);
    }

    /**
     * Get HTML format content out of base Text
     *
     * @param baseTexts
     * @return HTML format contents
     */
    public List<String> getHtmlContentFromBaseText(List<String> baseTexts) {
        List<String> htmlContents = new ArrayList<>();
        for (String baseText : baseTexts) {
            JsonObject jsonObject = GSON.fromJson(baseText, JsonObject.class);
            if (jsonObject.has(HTML_CONTENT_KEY)) {
                htmlContents.add(jsonObject.get(HTML_CONTENT_KEY).toString());
            }
        }
        return htmlContents;
    }
}