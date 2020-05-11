package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.controller.models.CreateNoteParams;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.UpdateNoteParams;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.NoteRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Repository
public class NoteDaoJpa extends ProjectItemDaoJpa<NoteContent> {

    private static final Gson GSON = new Gson();
    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private ProjectDaoJpa projectDaoJpa;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private ProjectNotesRepository projectNotesRepository;
    @Autowired
    private NoteContentRepository noteContentRepository;
    @Autowired
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;
    @Autowired
    private UserAliasDaoJpa userAliasDaoJpa;

    @Override
    public JpaRepository getJpaRepository() {
        return this.noteRepository;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Note> getNotes(Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        if (project.isShared()) {
            return this.sharedProjectItemDaoJpa.getSharedProjectItems(requester, ProjectType.NOTE);
        }

        Optional<ProjectNotes> projectNotesOptional = this.projectNotesRepository.findById(projectId);
        if (!projectNotesOptional.isPresent()) {
            return Collections.emptyList();
        }
        ProjectNotes projectNotes = projectNotesOptional.get();
        final Map<Long, Note> notesMap = this.noteRepository.findNoteByProject(project).stream()
                .collect(Collectors.toMap(n -> n.getId(), n -> n));
        return NoteRelationsProcessor.processRelations(notesMap, projectNotes.getNotes()).stream()
                .map(note -> addLabels(note, notesMap)).collect(Collectors.toList());
    }

    private com.bulletjournal.controller.models.Note addLabels(com.bulletjournal.controller.models.Note note,
            Map<Long, Note> notesMap) {
        List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(notesMap.get(note.getId()));
        note.setLabels(labels);
        for (com.bulletjournal.controller.models.Note subNote : note.getSubNotes()) {
            addLabels(subNote, notesMap);
        }
        return note;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Note create(Long projectId, String owner, CreateNoteParams createNoteParams) {
        Project project = this.projectDaoJpa.getProject(projectId, owner);
        if (!ProjectType.NOTE.equals(ProjectType.getType(project.getType()))) {
            throw new BadRequestException("Project Type expected to be NOTE while request is " + project.getType());
        }
        Note note = new Note();
        note.setProject(project);
        note.setOwner(owner);
        note.setName(createNoteParams.getName());
        note = this.noteRepository.save(note);
        final ProjectNotes projectNotes = this.projectNotesRepository.findById(projectId).orElseGet(ProjectNotes::new);
        String newRelations = HierarchyProcessor.addItem(projectNotes.getNotes(), note.getId());
        projectNotes.setNotes(newRelations);
        projectNotes.setProjectId(projectId);
        projectNotesRepository.save(projectNotes);
        return note;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Note partialUpdate(String requester, Long noteId, UpdateNoteParams updateNoteParams) {
        Note note = this.getProjectItem(noteId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(note.getOwner(), requester, ContentType.NOTE,
                Operation.UPDATE, noteId, note.getProject().getOwner());

        DaoHelper.updateIfPresent(updateNoteParams.hasName(), updateNoteParams.getName(),
                (value) -> note.setName(value));

        return this.noteRepository.save(note);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.Note getNote(String requester, Long id) {
        Note note = this.getProjectItem(id, requester);
        List<com.bulletjournal.controller.models.Label> labels = this.getLabelsToProjectItem(note);
        return note.toPresentationModel(labels);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Note> getNotesByOwner(Long projectId, String requester,
            String owner) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        if (project.isShared()) {
            return Collections.emptyList();
        }

        List<Note> notes = this.noteRepository.findNotesByOwnerAndProject(owner, project);
        notes.sort(ProjectItemsGrouper.NOTE_COMPARATOR);
        return notes.stream().map(t -> {
            List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(t);
            return t.toPresentationModel(labels);
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserNotes(Long projectId, List<com.bulletjournal.controller.models.Note> notes) {
        Optional<ProjectNotes> projectNotesOptional = this.projectNotesRepository.findById(projectId);
        final ProjectNotes projectNotes = projectNotesOptional.isPresent() ? projectNotesOptional.get()
                : new ProjectNotes();

        projectNotes.setNotes(NoteRelationsProcessor.processRelations(notes));
        projectNotes.setProjectId(projectId);
        this.projectNotesRepository.save(projectNotes);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> deleteNote(String requester, Long noteId) {
        Note note = this.getProjectItem(noteId, requester);

        Project project = deleteNoteAndAdjustRelations(requester, note,
                (targetNotes) -> this.noteRepository.deleteAll(targetNotes), (target) -> {
                });

        return generateEvents(note, requester, project);
    }

    private Project deleteNoteAndAdjustRelations(String requester, Note note, Consumer<List<Note>> targetNotesOperator,
            Consumer<HierarchyItem> targetOperator) {
        Project project = note.getProject();
        Long projectId = project.getId();
        this.authorizationService.checkAuthorizedToOperateOnContent(note.getOwner(), requester, ContentType.NOTE,
                Operation.DELETE, projectId, project.getOwner());

        ProjectNotes projectNotes = this.projectNotesRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectTasks by " + projectId + " not found"));

        String relations = projectNotes.getNotes();

        // delete notes and its subNotes
        List<Note> targetNotes = this.noteRepository
                .findAllById(HierarchyProcessor.getSubItems(relations, note.getId()));
        targetNotesOperator.accept(targetNotes);

        // Update note relations
        HierarchyItem[] target = new HierarchyItem[1];
        List<HierarchyItem> hierarchy = HierarchyProcessor.removeTargetItem(relations, note.getId(), target);
        targetOperator.accept(target[0]);

        projectNotes.setNotes(GSON.toJson(hierarchy));
        this.projectNotesRepository.save(projectNotes);

        return project;
    }

    private List<Event> generateEvents(Note note, String requester, Project project) {
        List<Event> events = new ArrayList<>();
        for (UserGroup userGroup : project.getGroup().getAcceptedUsers()) {
            // skip send event to self
            String username = userGroup.getUser().getName();
            if (userGroup.getUser().getName().equals(requester)) {
                continue;
            }
            events.add(new Event(username, note.getId(), note.getName()));
        }
        return events;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void move(String requester, Long noteId, Long targetProject) {
        final Project project = this.projectDaoJpa.getProject(targetProject, requester);

        Note note = this.getProjectItem(noteId, requester);

        if (!Objects.equals(note.getProject().getType(), project.getType())) {
            throw new BadRequestException("Cannot move to Project Type " + project.getType());
        }

        this.authorizationService.checkAuthorizedToOperateOnContent(note.getOwner(), requester, ContentType.NOTE,
                Operation.UPDATE, project.getId(), project.getOwner());

        deleteNoteAndAdjustRelations(requester, note, (targetTasks) -> targetTasks.forEach((t) -> {
            t.setProject(project);
            this.noteRepository.save(t);
        }), (target) -> {
            final ProjectNotes projectNotes = this.projectNotesRepository.findById(targetProject)
                    .orElseGet(ProjectNotes::new);
            String newRelations = HierarchyProcessor.addItem(projectNotes.getNotes(), target);
            projectNotes.setNotes(newRelations);
            projectNotes.setProjectId(targetProject);
            this.projectNotesRepository.save(projectNotes);
        });
    }

    @Override
    public JpaRepository getContentJpaRepository() {
        return this.noteContentRepository;
    }

    @Override
    public <T extends ProjectItemModel> List<NoteContent> findContents(T projectItem) {
        return this.noteContentRepository.findNoteContentByNote((Note) projectItem);
    }

    @Override
    List<Long> findItemLabelsByProject(Project project) {
        return noteRepository.findUniqueLabelsByProject(project.getId());
    }
}