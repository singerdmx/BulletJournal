package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.SharedProjectItem;
import com.bulletjournal.repository.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedProjectItemRepository extends JpaRepository<SharedProjectItem, Long>,
        SharedProjectItemRepositoryCustom {
    List<SharedProjectItem> findByUsername(String username);

    List<SharedProjectItem> findByTask(Task task);

    List<SharedProjectItem> findByNote(Note note);

    SharedProjectItem findSharedProjectItemByTaskAndAndUsername(Task task, String username);

    SharedProjectItem findSharedProjectItemByNoteAndAndUsername(Note note, String username);
}
