package com.bulletjournal.repository;

import com.bulletjournal.repository.models.NoteAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public interface NoteAuditableRepository extends PagingAndSortingRepository<NoteAuditable, Long> {
    Page<NoteAuditable> findAllByNoteId(Long noteId, Pageable pageable);

    Page<NoteAuditable> findAllByNoteIdAndActivityTimeBetween(
            Long noteId, Timestamp activityTimeStart, Timestamp activityTimeEnd, Pageable pageable);
}
