package com.bulletjournal.templates.repository;

import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.templates.repository.model.UserSampleTask;
import com.bulletjournal.templates.repository.model.UserSampleTaskKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class UserSampleTaskDaoJpa {
  private static Logger LOGGER = LoggerFactory.getLogger(UserSampleTaskDaoJpa.class);

  @Autowired
  private UserDaoJpa userDaoJpa;

  @Autowired
  private UserSampleTaskRepository userSampleTaskRepository;

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public void save(List<UserSampleTask> userSampleTasks) {
      userSampleTaskRepository.saveAll(userSampleTasks);
  }

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public List<UserSampleTask> getUserSampleTaskByUserName(String username) {
    User user = userDaoJpa.getByName(username);
    return userSampleTaskRepository.getAllByUser(user);
  }

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public boolean checkExist(UserSampleTaskKey userSampleTaskKey) {
    return userSampleTaskRepository.existsById(userSampleTaskKey);
  }
}
