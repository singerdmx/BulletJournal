package com.bulletjournal.templates.repository;

import com.bulletjournal.repository.models.User;
import com.bulletjournal.templates.repository.model.UserSampleTask;
import com.bulletjournal.templates.repository.model.UserSampleTaskKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSampleTaskRepository extends JpaRepository<UserSampleTask, UserSampleTaskKey> {
  List<UserSampleTask> getAllByUser(User user);
}
