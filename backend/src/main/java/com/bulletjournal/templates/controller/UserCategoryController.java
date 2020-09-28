package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveUserFromGroupEvent;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.RemoveUserCategoryParams;
import com.bulletjournal.templates.repository.SelectionDaoJpa;
import com.bulletjournal.templates.repository.SelectionMetadataKeywordDaoJpa;
import com.bulletjournal.templates.repository.UserCategoryDaoJpa;
import com.bulletjournal.templates.repository.model.UserCategory;
import com.bulletjournal.templates.repository.model.UserCategoryKey;
import com.google.common.collect.ImmutableList;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
public class UserCategoryController {
  public static final String REMOVE_USER_CATEGORY_ROUTE = "/api/removeUserCategory";

  @Autowired
  private UserCategoryDaoJpa userCategoryDaoJpa;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private UserDaoJpa userDaoJpa;

  @Autowired
  private SelectionMetadataKeywordDaoJpa selectionMetadataKeywordDaoJpa;

  @PostMapping(REMOVE_USER_CATEGORY_ROUTE)
  public UserCategory removeUserCategory(
      @Valid @PathVariable RemoveUserCategoryParams removeUserCategoryParams) {
    String username = MDC.get(UserClient.USER_NAME_KEY);
    Long categoryId = removeUserCategoryParams.getCategoryId();
    Long selectionId = removeUserCategoryParams.getSelectionId();
    List<Event> events =
        this.userCategoryDaoJpa.removeUserCategories(
            username, ImmutableList.of(removeUserCategoryParams));

    // TODO: Notification
    //    if (!events.isEmpty()) {
    //      this.notificationService.inform(new RemoveUserFromGroupEvent(events, username));
    //    }

    return userCategoryDaoJpa.getUserCategoryByKey(
        new UserCategoryKey(
            userDaoJpa.getByName(username).getId(),
            categoryId,
            selectionMetadataKeywordDaoJpa.getKeywordsBySelections(ImmutableList.of(selectionId)).get(0)));
  }
}
