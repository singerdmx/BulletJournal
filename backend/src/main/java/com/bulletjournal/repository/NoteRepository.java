package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long>, NoteRepositoryCustom {
    @Query(value = "SELECT DISTINCT unnest(labels) AS uniqueLabels FROM notes WHERE notes.project_id = :project_id", nativeQuery = true)
    List<Long> findUniqueLabelsByProject(@Param("project_id") Long projectId);

    List<Note> findNoteByProject(Project project);

    List<Note> findNotesByOwnerAndProject(String owner, Project project);

    @Query(value = "SELECT note FROM Note note WHERE note.project = :project AND "
            + "note.updatedAt >= :startTime AND note.updatedAt <= :endTime")
    List<Note> findNotesBetween(@Param("project") Project project, @Param("startTime") Timestamp startTime,
                                @Param("endTime") Timestamp endTime);

    @Query(value = "SELECT note FROM Note note WHERE " +
            "note.project IN (:projects) AND note.updatedAt >= :startTime AND note.updatedAt <= :endTime")
    List<Note> findNotesBetween(@Param("startTime") Timestamp startTime,
                                @Param("endTime") Timestamp endTime,
                                @Param("projects") List<Project> projects);
}