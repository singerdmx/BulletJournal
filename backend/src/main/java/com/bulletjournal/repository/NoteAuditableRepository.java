package com.bulletjournal.repository;

import com.bulletjournal.repository.models.NoteAuditable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteAuditableRepository extends PagingAndSortingRepository<NoteAuditable, Long> {
    List<NoteAuditable> findAllByNoteId(Long noteId, Pageable pageable);
}
