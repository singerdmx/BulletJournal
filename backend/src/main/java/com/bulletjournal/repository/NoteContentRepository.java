package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.NoteContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface NoteContentRepository extends JpaRepository<NoteContent, Long> {
    List<NoteContent> findNoteContentByNote(Note note);

    @Query("SELECT noteContent FROM NoteContent noteContent WHERE noteContent.updatedAt >= :startTime AND noteContent.updatedAt <= :endTime")
    List<NoteContent> findRecentNoteContentsBetween(@Param("startTime") Timestamp startTime,
                                                    @Param("endTime") Timestamp endTime);


    @Query(nativeQuery = true, value = "SELECT id FROM note_contents WHERE note_contents.note_id IN (:noteIds)")
    List<Long> findAllByNoteIds(List<Long> noteIds);
}