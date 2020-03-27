package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByNameAndOwner(String name, String owner);

    @Query("SELECT g FROM Group g WHERE g.owner = ?1 AND g.defaultGroup = TRUE")
    List<Group> findDefaultGroup(String owner);
}
