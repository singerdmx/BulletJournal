package com.bulletjournal.messaging;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.Content;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.UserAliasDaoJpa;
import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.models.Transaction;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

@Component
public class FreeMarkerClient {

  private static final Logger LOGGER = LoggerFactory.getLogger(FreeMarkerClient.class);
  private final Configuration freemarkerConfig;
  private final UserClient userClient;
  private final UserAliasDaoJpa userAliasDaoJpa;

  public FreeMarkerClient(
      Configuration freemarkerConfig,
      UserClient userClient,
      UserAliasDaoJpa userAliasDaoJpa) {
    this.freemarkerConfig = freemarkerConfig;
    this.userAliasDaoJpa = userAliasDaoJpa;
    this.userClient = userClient;
  }

  /**
   * convert given project item to HTML string
   */
  public <T extends ProjectItemModel> String convertProjectItemIntoHtmlString(
      T projectItem, String requester, List<Content> contents)
      throws IOException, TemplateException {
    Map<String, Object> data = new HashMap<>();
    String templateName = "";
    data.put("requester", requester);
    data.put("requester_avatar", userClient.getAvatar(requester));
    data.put("contents", contents);

    switch (projectItem.getContentType()) {
      case TASK:
        templateName = "TaskEmail.ftl";

        Task task = (Task) projectItem;
        List<String> assignees = userAliasDaoJpa.getAliases(task.getAssignees());
        data.put("assignee", assignees.stream().sorted().collect(Collectors.joining(", ")));
        data.put("task_owner", task.getOwner());
        data.put("task_name", task.getName());
        data.put("create_at", task.getCreatedAt());
        data.put("update_at", task.getUpdatedAt());
        data.put("location", task.getLocation());
        data.put("due_date", task.getDueDate());
        break;
      case NOTE:
        templateName = "NoteEmail.ftl";

        Note note = (Note) projectItem;
        data.put("note_owner", note.getOwner());
        data.put("note_name", note.getName());
        data.put("create_at", note.getCreatedAt());
        data.put("update_at", note.getUpdatedAt());
        data.put("location", note.getLocation());
        break;
      case TRANSACTION:
        templateName = "TransactionEmail.ftl";

        Transaction transaction = (Transaction) projectItem;
        data.put("transaction_owner", transaction.getOwner());
        data.put("transaction_name", transaction.getName());
        data.put("create_at", transaction.getCreatedAt());
        data.put("update_at", transaction.getUpdatedAt());
        data.put("location", transaction.getLocation());
        data.put("amount", transaction.getAmount());
        data.put("payer", transaction.getPayer());
        data.put("contents", contents);
        data.put("date", transaction.getDate());
        data.put("start_time", transaction.getStartTime());
        data.put("end_time", transaction.getEndTime());
        break;
      default:
        LOGGER.error("convertProjectItemIntoHtmlString failed. Unrecognized project item content type");
        throw new ResourceNotFoundException("convertProjectItemIntoHtmlString failed. Unrecognized project item content type");
    }
    return this.generateHtml(templateName, data);
  }

  /**
   * generate HTML by template name && data
   *
   * @param templateName template name
   * @param data         data passed to freemarker template
   * @return generated html
   * @throws IOException       error when get template
   * @throws TemplateException error when get html string
   */
  public String generateHtml(String templateName, Map<String, Object> data)
      throws IOException, TemplateException {
    Template template = freemarkerConfig.getTemplate(templateName);
    return FreeMarkerTemplateUtils.processTemplateIntoString(template, data);
  }
}
