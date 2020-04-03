package com.bulletjournal.repository;

import com.bulletjournal.repository.models.PublicProjectItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicProjectItemRepository extends JpaRepository<PublicProjectItem, String> {
    List<PublicProjectItem> findByUsername(String username);
}
