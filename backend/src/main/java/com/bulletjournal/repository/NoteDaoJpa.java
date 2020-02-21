package com.bulletjournal.repository;

import com.bulletjournal.controller.models.CreateNoteParams;
import com.bulletjournal.controller.models.UpdateNoteParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class NoteDaoJpa {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Note> getNotes(Long projectId) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        return this.noteRepository.findNoteByProject(project);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Note create(Long projectId, String owner, CreateNoteParams createNoteParams) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        Note note = new Note();
        note.setProject(project);
        note.setCreatedBy(owner);
        note.setName(createNoteParams.getName());
        return this.noteRepository.save(note);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Note partialUpdate(String owner, Long noteId, UpdateNoteParams updateNoteParams) {
        Note note = this.noteRepository
                .findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note " + noteId + " not found"));

        DaoHelper.updateIfPresent(
                updateNoteParams.hasName(), updateNoteParams.getName(), (value) -> note.setName(value));

        return this.noteRepository.save(note);
    }

}