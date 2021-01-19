package com.bulletjournal.repository;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.*;

import java.util.*;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class EmailContentDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailContentDaoJpa.class);
    private static final String CONTENT_TYPE_TASK = "task";
    private static final String CONTENT_TYPE_NOTE = "note";
    private static final String CONTENT_TYPE_TRANSACTION = "transaction";

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private GroupRepository groupRepository;


    /**
     * Send content by given usernames
     *
     * @param contentType     content type - task, note, transaction
     * @param contentParentId task id / note id / transaction id
     * @param htmlContent     sending content - suppose in HTML format
     * @param usernames       target usernames
     */
    public void sendContentsByUsernames(String contentType, Long contentParentId,
                                        String htmlContent, List<String> usernames) {
        String contentParentName = getContentParentName(contentType, contentParentId);
        List<String> targetEmails = getUserEmails(usernames);
        emailContentByTargetEmails(contentType, contentParentName, htmlContent, targetEmails);
    }

    /**
     * Send content by given group name
     *
     * @param contentType     content type - task, note, transaction
     * @param contentParentId task id / note id / transaction id
     * @param htmlContent     sending content - suppose in HTML format
     * @param groupName       target group name
     */
    public void sendContentsByGroupName(String contentType, Long contentParentId,
                                        String htmlContent, String groupName) {
        String contentParentName = getContentParentName(contentType, contentParentId);
        List<String> targetEmails = getGroupUserEmailsExceptRequester(groupName);
        emailContentByTargetEmails(contentType, contentParentName, htmlContent, targetEmails);
    }

    /**
     * Send content by given email addresses
     *
     * @param contentType     content type - task, note, transaction
     * @param contentParentId task id / note id / transaction id
     * @param htmlContent     sending content - suppose in HTML format
     * @param targetEmails    target emails
     */
    public void sendContentsByEmails(String contentType, Long contentParentId,
                                     String htmlContent, List<String> targetEmails) {
        String contentParentName = getContentParentName(contentType, contentParentId);
        emailContentByTargetEmails(contentType, contentParentName, htmlContent, targetEmails);
    }

    /**
     * Get content parent (task / note / transaction) name.
     *
     * @param contentType     content type - task, note, transaction
     * @param contentParentId task id / note id / transaction id
     * @return task / note / transaction name
     * @throws ResourceNotFoundException content type not in (task, note, transaction)
     * @throws ResourceNotFoundException requester is not the owner of task/note/transaction with given id.
     */
    public String getContentParentName(String contentType, Long contentParentId) {
        String contentParentName = "";
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        switch (contentType) {
            case CONTENT_TYPE_TASK:
                Task task = taskRepository.findByIdAndOwner(contentParentId, requester);
                if (task == null) {
                    String errMsg = "Unable to find out the task " + contentParentId + " under user " + requester;
                    LOGGER.error(errMsg);
                    throw new ResourceNotFoundException(errMsg);
                }
                contentParentName = task.getName();
                break;
            case CONTENT_TYPE_NOTE:
                Note note = noteRepository.findByIdAndOwner(contentParentId, requester);
                if (note == null) {
                    String errMsg = "Unable to find out the note " + contentParentId + " under user " + requester;
                    LOGGER.error(errMsg);
                    throw new ResourceNotFoundException(errMsg);
                }
                contentParentName = note.getName();
                break;
            case CONTENT_TYPE_TRANSACTION:
                Transaction transaction = transactionRepository.findByIdAndOwner(contentParentId, requester);
                if (transaction == null) {
                    String errMsg = "Unable to find out the transaction " + contentParentId
                            + " under user " + requester;
                    LOGGER.error(errMsg);
                    throw new ResourceNotFoundException(errMsg);
                }
                contentParentName = transaction.getName();
                break;
            default:
                break;
        }

        if (contentParentName.equals("")) {
            String errMsg = "Unable to find out the content type <" + contentType + ">.";
            LOGGER.error(errMsg);
            throw new ResourceNotFoundException(errMsg);
        }
        return contentParentName;
    }


    /**
     * Email content to target emails
     *
     * @param contentType       content type - task, note, transaction
     * @param contentParentName task name / note name / transaction name
     * @param htmlContent       sending content - suppose in HTML format
     * @param targetEmails      destination emails
     * TODO: send email part
     *       - Email Details
     *          -  title: [Task/Note/Transaction] [task/note/transaction name]
     *          -  [Requester][avatar] is sharing [task/note/transaction] [task/note/transaction name] with you
     *          -  <html></html>
     *       - Before sending
     *          - 1. Get requester avatar
     *          - 2. Filter out invalid emails
     *          - 3. Generate EmailContentTemplate Params
     */
    public void emailContentByTargetEmails(String contentType, String contentParentName,
                                           String htmlContent, List<String> targetEmails) {
        String requester = MDC.get(UserClient.USER_NAME_KEY);

        LOGGER.info(requester + " is sharing " + contentType + " <" + contentParentName + "> with you.");
        LOGGER.info("HTML content: " + htmlContent);
        LOGGER.info("Target Emails: " + targetEmails);

        // call send email related function
    }

    /**
     * Get user emails by usernames
     *
     * @param usernames target usernames
     * @return emails of given usernames
     * @throws ResourceNotFoundException if non of given usernames exist
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
     * @throws ResourceNotFoundException requester is not a member of given group
     */
    public List<String> getGroupUserEmailsExceptRequester(String groupName) {
        String requester = MDC.get(UserClient.USER_NAME_KEY);
        if (groupRepository.findByNameAndOwner(groupName, requester).size() == 0) {
            String errMsg = "Unable to find out the group name <" + groupName + "> under user <" + requester + ">";
            LOGGER.error(errMsg);
            throw new ResourceNotFoundException(errMsg);
        }
        List<String> usernamesWithoutRequester = groupRepository
                .findAllOwnerByName(groupName).stream()
                .filter(item -> !item.equals(requester)).collect(Collectors.toList());
        return getUserEmails(usernamesWithoutRequester);
    }
}
