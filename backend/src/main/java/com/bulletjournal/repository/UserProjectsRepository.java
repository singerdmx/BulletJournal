package com.bulletjournal.repository;

import com.bulletjournal.repository.models.UserProjects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProjectsRepository extends JpaRepository<UserProjects, String> {
}
