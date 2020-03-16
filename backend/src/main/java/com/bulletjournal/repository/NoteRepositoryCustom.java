package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Note;

import java.util.List;

public interface NoteRepositoryCustom {
    List<Note> findNotesByLabelIds(List<Long> labelIds);

    List<Note> findNotesByLabelId(Long labelId);
}
