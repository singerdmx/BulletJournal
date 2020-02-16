package com.bulletjournal.repository;

import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.models.UserGroupKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, UserGroupKey> {
}
