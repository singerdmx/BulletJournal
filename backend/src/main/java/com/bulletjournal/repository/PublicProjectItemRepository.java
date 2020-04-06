package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.PublicProjectItem;
import com.bulletjournal.repository.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicProjectItemRepository extends JpaRepository<PublicProjectItem, String> {
    List<PublicProjectItem> findByUsername(String username);
    List<PublicProjectItem> findByTask(Task task);
    List<PublicProjectItem> findByNote(Note note);
}
