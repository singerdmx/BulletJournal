package com.bulletjournal.repository;

import com.bulletjournal.repository.models.UserPointActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPointActivityRepository extends JpaRepository<UserPointActivity, Long> {
    @Query("SELECT t FROM UserPointActivity t WHERE t.username = ?1 order by t.createdAt desc ")
    List<UserPointActivity> findUserPointActivitiesByUsername(String username);
}
