package com.bulletjournal.repository;

import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.models.UserGroupKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, UserGroupKey> {
    @Query(value = "delete from user_groups where user_id = :userId and group_id = :groupId", nativeQuery = true)
    void deleteByUserIdAndGroupId(@Param("userId") Long userId, @Param("groupId") Long groupId);

}
