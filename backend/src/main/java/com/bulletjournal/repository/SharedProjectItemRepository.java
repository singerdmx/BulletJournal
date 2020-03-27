package com.bulletjournal.repository;

import com.bulletjournal.repository.models.SharedProjectItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SharedProjectItemRepository extends JpaRepository<SharedProjectItem, Long> {
}
