package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long>, NoteRepositoryCustom {
    @Query(value = "SELECT DISTINCT unnest(labels) AS uniqueLabels WHERE notes.project_id = :project_id",
            nativeQuery = true)
    List<Long> findUniqueLabelsByProject(@Param("project_id") Long projectId);

    List<Note> findNoteByProject(Project project);
}