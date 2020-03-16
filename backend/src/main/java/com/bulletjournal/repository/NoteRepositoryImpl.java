package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Note;
import com.google.common.collect.ImmutableList;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class NoteRepositoryImpl implements NoteRepositoryCustom {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<Note> findNotesByLabelIds(List<Long> labelIds) {
        StringBuilder queryString = new StringBuilder("SELECT * FROM notes WHERE ? = ANY(notes.labels)");
        for (int i = 1; i < labelIds.size(); i++) {
            queryString.append(" and ? = ANY(notes.labels)");
        }
        Query query = entityManager.createNativeQuery(queryString.toString(), Note.class);
        for (int i = 1; i <= labelIds.size(); i++) {
            query.setParameter(i, labelIds.get(i - 1));
        }
        return query.getResultList();
    }

    @Override
    public List<Note> findNotesByLabelId(Long labelId) {
        return findNotesByLabelIds(ImmutableList.of(labelId));
    }
}
