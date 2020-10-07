package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.BadRequestException;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public void removeUserSampleTasks(String requester, List<Long> sampleTaskIds) {
    if (sampleTaskIds.isEmpty()) {
      throw new BadRequestException("SampleTaskIds are empty.");
    }
    Long userId = this.userDaoJpa.getByName(requester).getId();

    List<UserSampleTaskKey>  userSampleTaskKeys = new ArrayList<>();
    for (Long sampleTaskId: sampleTaskIds) {
      userSampleTaskKeys.add(new UserSampleTaskKey(userId, sampleTaskId));
    }

    List<UserSampleTask> userSampleTasks = this.userSampleTaskRepository.findAllById(userSampleTaskKeys)
            .stream().filter(Objects::nonNull).collect(Collectors.toList());
    this.userSampleTaskRepository.deleteAll(userSampleTasks);
  }
}
