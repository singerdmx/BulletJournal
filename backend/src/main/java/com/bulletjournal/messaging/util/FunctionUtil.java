package com.bulletjournal.messaging.util;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.repository.UserAliasDaoJpa;
import java.util.ArrayList;
import java.util.List;
import java.util.function.BiFunction;

public class FunctionUtil {

  private static final String NONE_STRING = "NONE";

  /**
   * get user avatar
   */
  public static BiFunction<UserClient, String, String> getAvatar = ((userClient, username) -> {
    User user = userClient.getUser(username);
    if (user.getAvatar() != null) {
      return user.getAvatar();
    }
    return NONE_STRING;
  });

  /**
   * get list of given user alias
   */
  public static BiFunction<UserAliasDaoJpa, List<String>, List<String>> getAliases = (
    (userAliasDaoJpa, usernames) -> {
      List<String> aliases = new ArrayList<>();
      if (usernames == null) {
        return aliases;
      }

      for (String username : usernames) {
        String alias = userAliasDaoJpa.getAliases(username).getOrDefault(username, username);
        aliases.add(alias);
      }
      return aliases;
    });
}
