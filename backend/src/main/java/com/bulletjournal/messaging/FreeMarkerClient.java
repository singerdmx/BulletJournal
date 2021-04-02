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
  // Templates
  private static final String NOTE_EMAIL_TEMPLATE = "NoteEmail.ftl";
  private static final String TASK_EMAIL_TEMPLATE = "TaskEmail.ftl";
  private static final String TRANSACTION_EMAIL_TEMPLATE = "TransactionEmail.ftl";
  private static final String PROJECT_ITEM_PDF_TEMPLATE = "ProjectItemPdf.ftl";
  private static final String PROJECT_ITEM_IMAGE_TEMPLATE = "ProjectItemImage.ftl";

  // PDF Templates Properties
  private static final String PROJECT_ITEM_TYPE_DATA_PROPERTY = "project_item_type";
  private static final String NOTE_TYPE_PROPERTY = "note";
  private static final String TASK_TYPE_PROPERTY = "task";
  private static final String TRANSACTION_TYPE_PROPERTY = "transaction";

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
        templateName = TASK_EMAIL_TEMPLATE;
        Task task = (Task) projectItem;
        this.addTaskInfoToDataModel(data, task);
        break;
      case NOTE:
        templateName = NOTE_EMAIL_TEMPLATE;
        Note note = (Note) projectItem;
        this.addNoteInfoToDataModel(data, note);
        break;
      case TRANSACTION:
        templateName = TRANSACTION_EMAIL_TEMPLATE;
        Transaction transaction = (Transaction) projectItem;
        this.addTransactionInfoToDataModel(data, transaction);
        break;
      default:
        LOGGER.error("convertProjectItemIntoHtmlString failed. Unrecognized project item content type");
        throw new ResourceNotFoundException("convertProjectItemIntoHtmlString failed. Unrecognized project item content type");
    }
    return this.generateHtml(templateName, data);
  }

  /**
   * convert given project item to HTML for PDF conversion using.
   */
  public <T extends ProjectItemModel> String convertProjectItemIntoPdfHtml(
      T projectItem, List<Content> contents) throws IOException, TemplateException {
    Map<String, Object> data = new HashMap<>();
    data.put("contents", contents);

    switch (projectItem.getContentType()) {
      case NOTE:
        Note note = (Note) projectItem;
        data.put(PROJECT_ITEM_TYPE_DATA_PROPERTY, NOTE_TYPE_PROPERTY);
        this.addNoteInfoToDataModel(data, note);
        break;
      case TASK:
        Task task = (Task) projectItem;
        data.put(PROJECT_ITEM_TYPE_DATA_PROPERTY, TASK_TYPE_PROPERTY);
        this.addTaskInfoToDataModel(data, task);
        break;
      case TRANSACTION:
        Transaction transaction = (Transaction) projectItem;
        data.put(PROJECT_ITEM_TYPE_DATA_PROPERTY, TRANSACTION_TYPE_PROPERTY);
        this.addTransactionInfoToDataModel(data, transaction);
        break;
      default:
        LOGGER.error(
            "ConvertProjectItemIntoPdfHtml failed. Unrecognized project item content type");
        throw new ResourceNotFoundException(
            "ConvertProjectItemIntoPdfHtml failed. Unrecognized project item content type");
    }
    return this.generateHtml(PROJECT_ITEM_PDF_TEMPLATE, data);
  }

  /**
   * convert given project item to HTML for PDF conversion using.
   */
  public <T extends ProjectItemModel> String convertProjectItemIntoImageHtml(
          T projectItem, List<Content> contents) throws IOException, TemplateException {
    Map<String, Object> data = new HashMap<>();
    data.put("contents", contents);

    switch (projectItem.getContentType()) {
      case NOTE:
        Note note = (Note) projectItem;
        data.put(PROJECT_ITEM_TYPE_DATA_PROPERTY, NOTE_TYPE_PROPERTY);
        this.addNoteInfoToDataModel(data, note);
        break;
      case TASK:
        Task task = (Task) projectItem;
        data.put(PROJECT_ITEM_TYPE_DATA_PROPERTY, TASK_TYPE_PROPERTY);
        this.addTaskInfoToDataModel(data, task);
        break;
      case TRANSACTION:
        Transaction transaction = (Transaction) projectItem;
        data.put(PROJECT_ITEM_TYPE_DATA_PROPERTY, TRANSACTION_TYPE_PROPERTY);
        this.addTransactionInfoToDataModel(data, transaction);
        break;
      default:
        LOGGER.error(
                "ConvertProjectItemIntoPdfHtml failed. Unrecognized project item content type");
        throw new ResourceNotFoundException(
                "ConvertProjectItemIntoPdfHtml failed. Unrecognized project item content type");
    }
    return this.generateHtml(PROJECT_ITEM_IMAGE_TEMPLATE, data);
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

  /**
   * Add task information to data model
   */
  private void addTaskInfoToDataModel(Map<String, Object> dataModel, Task task) {
    List<String> assignees = userAliasDaoJpa.getAliases(task.getAssignees());
    dataModel.put("assignee", assignees.stream().sorted().collect(Collectors.joining(", ")));
    dataModel.put("task_owner", task.getOwner());
    dataModel.put("task_name", task.getName());
    dataModel.put("create_at", task.getCreatedAt());
    dataModel.put("update_at", task.getUpdatedAt());
    dataModel.put("location", task.getLocation());
    dataModel.put("due_date", task.getDueDate());
  }

  /**
   * Add note information to data model
   */
  private void addNoteInfoToDataModel(Map<String, Object> dataModel, Note note) {
    dataModel.put("note_owner", note.getOwner());
    dataModel.put("note_name", note.getName());
    dataModel.put("create_at", note.getCreatedAt());
    dataModel.put("update_at", note.getUpdatedAt());
    dataModel.put("location", note.getLocation());
  }

  /**
   * Add transaction information to data model
   */
  private void addTransactionInfoToDataModel(Map<String, Object> dataModel, Transaction transaction) {
    dataModel.put("transaction_owner", transaction.getOwner());
    dataModel.put("transaction_name", transaction.getName());
    dataModel.put("create_at", transaction.getCreatedAt());
    dataModel.put("update_at", transaction.getUpdatedAt());
    dataModel.put("location", transaction.getLocation());
    dataModel.put("amount", transaction.getAmount());
    dataModel.put("payer", transaction.getPayer());
    dataModel.put("date", transaction.getDate());
    dataModel.put("start_time", transaction.getStartTime());
    dataModel.put("end_time", transaction.getEndTime());
  }

}
