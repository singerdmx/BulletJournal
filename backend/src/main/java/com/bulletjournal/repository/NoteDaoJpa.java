package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateNoteParams;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.UpdateNoteParams;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.NoteRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Repository
public class NoteDaoJpa extends ProjectItemDaoJpa<NoteContent> {

    private static final Gson GSON = new Gson();

    @PersistenceContext
    EntityManager entityManager;
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
    private SearchIndexDaoJpa searchIndexDaoJpa;

    @Override
    public JpaRepository getJpaRepository() {
        return this.noteRepository;
    }

    @Retryable(value = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 100))
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Note> getNotes(Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        Optional<ProjectNotes> projectNotesOptional = this.projectNotesRepository.findById(projectId);

        if (project.isShared()) {
            List<Note> notes = this.sharedProjectItemDaoJpa.
                    getSharedProjectItems(requester, ContentType.NOTE).stream()
                    .filter(obj -> obj instanceof Note)
                    .map(projectItemModel -> (Note) projectItemModel).collect(Collectors.toList());

            List<com.bulletjournal.controller.models.Note> ret = new ArrayList<>();

            if (projectNotesOptional.isPresent()) {
                ProjectNotes projectNotes = projectNotesOptional.get();
                Set<Long> existingIds = notes.stream().map(note -> note.getId()).collect(Collectors.toSet());

                Pair<List<HierarchyItem>, Set<Long>> hierarchy =
                        HierarchyProcessor.findAllIds(projectNotes.getNotes(), existingIds);

                List<HierarchyItem> keptHierarchy = hierarchy.getLeft();
                Set<Long> processedIds = hierarchy.getRight();

                final Map<Long, Note> noteMap = notes.stream().filter(n -> processedIds.contains(n.getId()))
                        .collect(Collectors.toMap(n -> n.getId(), n -> n));

                ret.addAll(NoteRelationsProcessor.processRelations(noteMap, keptHierarchy).stream()
                        .map(note -> addLabels(note, noteMap)).collect(Collectors.toList()));

                notes = notes.stream().filter(t -> !processedIds.contains(t.getId())).collect(Collectors.toList());
            }

            ret.addAll(this.labelDaoJpa.getLabelsForProjectItemList(notes.stream().map(
                    n -> {
                        com.bulletjournal.controller.models.Note note = n.toPresentationModel();
                        note.setShared(true);
                        return note;
                    }
            ).collect(Collectors.toList())));

            return ret;
        }

        if (!projectNotesOptional.isPresent()) {
            return Collections.emptyList();
        }
        ProjectNotes projectNotes = projectNotesOptional.get();
        final Map<Long, Note> notesMap = this.noteRepository.findNoteByProject(project).stream()
                .collect(Collectors.toMap(n -> n.getId(), n -> n));
        return NoteRelationsProcessor.processRelations(notesMap, projectNotes.getNotes()).stream()
                .map(n -> addLabels(n, notesMap)).collect(Collectors.toList());
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
    public List<com.bulletjournal.controller.models.Note> getNotesByOrder(Long projectId, String requester,
                                                                          String startDate, String endDate, String timezone) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        List<Note> notes;
        if (project.isShared()) {
            notes = this.sharedProjectItemDaoJpa.
                    getSharedProjectItems(requester, ContentType.NOTE).stream()
                    .filter(obj -> obj instanceof Note)
                    .map(projectItemModel -> (Note) projectItemModel).collect(Collectors.toList());
        } else {
            if (StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate)) {
                notes = this.noteRepository.findNoteByProject(project);
            } else {
                // Set start time and end time
                ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
                ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);
                notes = this.noteRepository.findNotesBetween(project, Timestamp.from(startTime.toInstant()),
                        Timestamp.from(endTime.toInstant()));
            }
        }

        notes.sort(ProjectItemsGrouper.NOTE_COMPARATOR);
        return notes.stream().map(t -> {
            List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(t);
            com.bulletjournal.controller.models.Note note = t.toPresentationModel(labels);
            note.setShared(project.isShared());
            return note;
        }).collect(Collectors.toList());
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
        if (createNoteParams.getLabels() != null && !createNoteParams.getLabels().isEmpty()) {
            note.setLabels(createNoteParams.getLabels());
        }
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

        if (updateNoteParams.hasLabels()) {
            note.setLabels(updateNoteParams.getLabels());
        }

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
    public Pair<List<Event>, Note> deleteNote(String requester, Long noteId) {
        Note note = this.getProjectItem(noteId, requester);

        Project project = deleteNoteAndAdjustRelations(requester, note,
                (targetNotes) -> this.noteRepository.deleteAll(targetNotes), (target) -> {
                });

        return Pair.of(generateEvents(note, requester, project), note);
    }

    private Project deleteNoteAndAdjustRelations(String requester, Note note, Consumer<List<Note>> targetNotesOperator,
                                                 Consumer<HierarchyItem> targetOperator) {
        Project project = note.getProject();
        Long projectId = project.getId();
        this.authorizationService.checkAuthorizedToOperateOnContent(note.getOwner(), requester, ContentType.NOTE,
                Operation.DELETE, projectId, project.getOwner());

        ProjectNotes projectNotes = this.projectNotesRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectNotes by " + projectId + " not found"));

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
    public Pair<Note, Project> move(String requester, Long noteId, Long targetProject) {
        final Project project = this.projectDaoJpa.getProject(targetProject, requester);

        Note note = this.getProjectItem(noteId, requester);

        if (!Objects.equals(note.getProject().getType(), project.getType())) {
            throw new BadRequestException("Cannot move to Project Type " + project.getType());
        }

        this.authorizationService.checkAuthorizedToOperateOnContent(note.getOwner(), requester, ContentType.NOTE,
                Operation.UPDATE, project.getId(), project.getOwner());

        deleteNoteAndAdjustRelations(requester, note, (targetNotes) -> targetNotes.forEach((t) -> {
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

        return Pair.of(note, project);
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

    @Override
    List<Task> findRecentProjectItemsBetween(Timestamp startTime, Timestamp endTime, List projects) {
        return this.noteRepository.findNotesBetween(startTime, endTime, projects);
    }

    @Override
    public List<Object[]> findRecentProjectItemContentsBetween(Timestamp startTime, Timestamp endTime, List projectIds) {
        StringBuilder queryBuilder = new StringBuilder(
                "SELECT notes_join_note_contents.id, notes_join_note_contents.most_recent_time " +
                        "FROM notes_join_note_contents " +
                        "WHERE notes_join_note_contents.most_recent_time >= ? " +
                        "AND notes_join_note_contents.most_recent_time <= ? " +
                        "AND notes_join_note_contents.project_id IN (");
        projectIds.stream().forEach(pi -> queryBuilder.append(pi).append(","));
        int tail = queryBuilder.length() - 1;
        if (queryBuilder.charAt(tail) == ',') {
            queryBuilder.deleteCharAt(tail);
        }
        queryBuilder.append(")");
        return entityManager.createNativeQuery(queryBuilder.toString())
                .setParameter(1, startTime)
                .setParameter(2, endTime)
                .getResultList();
    }

    public List<String> getDeleteESDocumentIdsForProjectItem(String requester, Long noteId) {
        List<String> deleteESDocumentIds = new ArrayList<>();
        Note note = this.getProjectItem(noteId, requester);

        deleteESDocumentIds.add(this.searchIndexDaoJpa.getProjectItemSearchIndexId(note));
        List<NoteContent> noteContents = findContents(note);
        for (NoteContent content : noteContents) {
            deleteESDocumentIds.add(this.searchIndexDaoJpa.getContentSearchIndexId(content));
        }

        return deleteESDocumentIds;
    }

    public List<String> getDeleteESDocumentIdsForContent(String requester, Long contentId) {
        List<String> deleteESDocumentIds = new ArrayList<>();
        NoteContent content = this.getContent(contentId, requester);
        deleteESDocumentIds.add(this.searchIndexDaoJpa.getContentSearchIndexId(content));

        return deleteESDocumentIds;
    }
}
