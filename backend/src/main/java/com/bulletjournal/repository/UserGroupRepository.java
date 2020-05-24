package com.bulletjournal.repository;

import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.models.UserGroupKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, UserGroupKey> {
    List<UserGroup> findAllByGroupIdAndAccepted(Long groupId, Boolean accepted);

    List<UserGroup> findAllByUserId(Long userId);
}
