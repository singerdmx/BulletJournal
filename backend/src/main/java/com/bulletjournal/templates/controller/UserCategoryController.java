package com.bulletjournal.templates.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.templates.controller.model.RemoveUserCategoryParams;
import com.bulletjournal.templates.repository.SelectionMetadataKeywordDaoJpa;
import com.bulletjournal.templates.repository.UserCategoryDaoJpa;
import com.bulletjournal.templates.repository.model.UserCategoryKey;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

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
  public UserCategoryKey removeUserCategory(
      @Valid @RequestBody RemoveUserCategoryParams removeUserCategoryParams) {
    String username = MDC.get(UserClient.USER_NAME_KEY);
    return this.userCategoryDaoJpa.removeUserCategories(username, removeUserCategoryParams);
  }
}
