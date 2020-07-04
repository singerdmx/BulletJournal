package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(String owner);

    List<Project> findByNameAndOwner(String name, String owner);

    List<Project> findByOwnerAndSharedTrue(String owner);
}