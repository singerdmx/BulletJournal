package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateNoteParams;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.UpdateNoteParams;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.NoteRelationsProcessor;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.gson.Gson;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class NoteDaoJpa {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuthorizationService authorizationService;

    @Autowired
    private ProjectNotesRepository projectNotesRepository;

    private static final Gson GSON = new Gson();

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Note> getNotes(Long projectId) {
        Optional<ProjectNotes> projectNotesOptional = this.projectNotesRepository.findById(projectId);
        if (!projectNotesOptional.isPresent()) {
            return Collections.emptyList();
        }
        ProjectNotes projectNotes = projectNotesOptional.get();
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        Map<Long, Note> notes = this.noteRepository.findNoteByProject(project)
                .stream().collect(Collectors.toMap(n -> n.getId(), n -> n));
        return NoteRelationsProcessor.processRelations(notes, projectNotes.getNotes());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Note create(Long projectId, String owner, CreateNoteParams createNoteParams) {
        Project project = this.projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        if (!ProjectType.NOTE.equals(ProjectType.getType(project.getType()))) {
            throw new BadRequestException("Project Type expected to be NOTE while request is " + project.getType());
        }
        Note note = new Note();
        note.setProject(project);
        note.setOwner(owner);
        note.setName(createNoteParams.getName());
        note = this.noteRepository.save(note);
        Optional<ProjectNotes> projectNotesOptional = this.projectNotesRepository.findById(projectId);
        final ProjectNotes projectNotes = projectNotesOptional.isPresent() ?
                projectNotesOptional.get() : new ProjectNotes();
        String newRelations = HierarchyProcessor.addItem(projectNotes.getNotes(), note.getId());
        projectNotes.setNotes(newRelations);
        projectNotes.setProjectId(projectId);
        projectNotesRepository.save(projectNotes);
        return note;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Note partialUpdate(String requester, Long noteId, UpdateNoteParams updateNoteParams) {
        Note note = this.noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note " + noteId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                note.getOwner(), requester, ContentType.NOTE, Operation.UPDATE, noteId,
                note.getProject().getOwner());

        DaoHelper.updateIfPresent(updateNoteParams.hasName(), updateNoteParams.getName(),
                (value) -> note.setName(value));

        return this.noteRepository.save(note);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Note getNote(Long id) {
        return this.noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note " + id + " not found"));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserNotes(Long projectId, List<com.bulletjournal.controller.models.Note> notes) {
        Optional<ProjectNotes> projectNotesOptional = this.projectNotesRepository.findById(projectId);
        final ProjectNotes projectNotes = projectNotesOptional.isPresent() ?
        projectNotesOptional.get() : new ProjectNotes();

        projectNotes.setNotes(NoteRelationsProcessor.processRelations(notes));
        projectNotes.setProjectId(projectId);
        this.projectNotesRepository.save(projectNotes);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> deleteNote(String requester, Long noteId) {
        Note note = this.noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note " + noteId + " not found"));

        Project project = note.getProject();
        Long projectId = project.getId();
        this.authorizationService.checkAuthorizedToOperateOnContent(note.getOwner(), requester, ContentType.NOTE,
                Operation.DELETE, projectId, project.getOwner());

        ProjectNotes projectNotes = this.projectNotesRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectNotes by " + projectId + " not found"));
        String relations = projectNotes.getNotes();

        // delete notes and its subNotes
        List<Note> targetNotes = this.noteRepository.findAllById(HierarchyProcessor.getSubItems(relations, noteId));
        this.noteRepository.deleteAll(targetNotes);

        // Update note relations
        List<HierarchyItem> hierarchy = HierarchyProcessor.removeTargetItem(relations, noteId);
        projectNotes.setNotes(GSON.toJson(hierarchy));
        this.projectNotesRepository.save(projectNotes);

        return generateEvents(note, requester, project);
    }

    private List<Event> generateEvents(Note note, String requester, Project project) {
        List<Event> events = new ArrayList<>();
        for (UserGroup userGroup : project.getGroup().getUsers()) {
            if (!userGroup.isAccepted()) {
                continue;
            }
            // skip send event to self
            String username = userGroup.getUser().getName();
            if (userGroup.getUser().getName().equals(requester)) {
                continue;
            }
            events.add(new Event(username, note.getId(), note.getName()));
        }
        return events;
    }

}