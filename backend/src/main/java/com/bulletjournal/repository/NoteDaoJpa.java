package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.params.CreateNoteParams;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.params.UpdateNoteParams;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.es.ESUtil;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.hierarchy.HierarchyItem;
import com.bulletjournal.hierarchy.HierarchyProcessor;
import com.bulletjournal.hierarchy.NoteRelationsProcessor;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.stream.Collectors;

@Repository
public class NoteDaoJpa extends ProjectItemDaoJpa<NoteContent> {
    private static final Logger LOGGER = LoggerFactory.getLogger(NoteDaoJpa.class);

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
    @Autowired
    private UserDaoJpa userDaoJpa;
    @Autowired
    private GroupDaoJpa groupDaoJpa;


    @Override
    public JpaRepository getJpaRepository() {
        return this.noteRepository;
    }

    @Retryable(value = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 100))
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Note> getNotes(Long projectId, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        Optional<ProjectNotes> projectNotesOptional = this.projectNotesRepository.findById(projectId);

        // source of truth
        List<Note> notes = project.isShared() ? this.sharedProjectItemDaoJpa.
                getSharedProjectItems(requester, ContentType.NOTE).stream()
                .filter(obj -> obj instanceof Note)
                .map(projectItemModel -> (Note) projectItemModel).collect(Collectors.toList()) :
                this.noteRepository.findNoteByProject(project);

        List<com.bulletjournal.controller.models.Note> ret = new ArrayList<>();
        if (projectNotesOptional.isPresent()) {
            ProjectNotes projectNotes = projectNotesOptional.get(); // this might have notes that has been deleted
            Set<Long> existingIds = notes.stream().map(note -> note.getId()).collect(Collectors.toSet());

            // left is real hierarchy but missing orphaned ones, right is processed ones
            Pair<List<HierarchyItem>, Set<Long>> hierarchy =
                    HierarchyProcessor.findAllIds(projectNotes.getNotes(), existingIds);

            List<HierarchyItem> keptHierarchy = hierarchy.getLeft();
            Set<Long> processedIds = hierarchy.getRight();

            // add processed ones
            final Map<Long, Note> noteMap = notes.stream().filter(n -> processedIds.contains(n.getId()))
                    .collect(Collectors.toMap(n -> n.getId(), n -> n));

            ret.addAll(NoteRelationsProcessor.processRelations(noteMap, keptHierarchy).stream()
                    .map(note -> addLabels(note, noteMap)).collect(Collectors.toList()));

            // add orphaned ones(not processed means orphaned)
            notes = notes.stream().filter(t -> !processedIds.contains(t.getId())).collect(Collectors.toList());
        }

        ret.addAll(this.labelDaoJpa.getLabelsForProjectItemList(
                notes.stream().sorted(Comparator.comparingLong(Note::getId))
                        .map(Note::toPresentationModel).collect(Collectors.toList())));
        return ret;
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
                notes = this.getRecentProjectItemsBetween(Timestamp.from(startTime.toInstant()),
                        Timestamp.from(endTime.toInstant()), Arrays.asList(projectId));
            }
        }

        notes.sort(ProjectItemsGrouper.NOTE_COMPARATOR_REVERSE_ORDER);
        return this.labelDaoJpa.getLabelsForProjectItemList(notes.stream()
                .map(Note::toPresentationModel).collect(Collectors.toList()));
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
        note.setLocation(createNoteParams.getLocation());
        if (createNoteParams.getLabels() != null && !createNoteParams.getLabels().isEmpty()) {
            note.setLabels(createNoteParams.getLabels());
        }
        return this.noteRepository.save(note);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Note partialUpdate(String requester, Long noteId, UpdateNoteParams updateNoteParams) {
        Note note = this.getProjectItem(noteId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(note.getOwner(), requester, ContentType.NOTE,
                Operation.UPDATE, noteId, note.getProject().getOwner());

        DaoHelper.updateIfPresent(updateNoteParams.hasName(), updateNoteParams.getName(),
                (value) -> note.setName(value));

        DaoHelper.updateIfPresent(updateNoteParams.hasLocation(), updateNoteParams.getLocation(),
                (value) -> note.setLocation(value));

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
        notes.sort(ProjectItemsGrouper.NOTE_COMPARATOR_REVERSE_ORDER);
        return notes.stream().map(t -> {
            List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(t);
            return t.toPresentationModel(labels);
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserNotes(
            Long projectId, List<com.bulletjournal.controller.models.Note> notes, String requester) {
        this.projectDaoJpa.getProject(projectId, requester);
        Optional<ProjectNotes> projectNotesOptional = this.projectNotesRepository.findById(projectId);
        final ProjectNotes projectNotes = projectNotesOptional.orElseGet(ProjectNotes::new);

        projectNotes.setNotes(NoteRelationsProcessor.processRelations(notes));
        projectNotes.setProjectId(projectId);
        this.projectNotesRepository.save(projectNotes);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<List<Event>, Note> deleteNote(String requester, Long noteId) {
        Note note = this.getProjectItem(noteId, requester);
        this.noteRepository.delete(note);
        return Pair.of(generateEvents(note, requester, note.getProject()), note);
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

        note.setProject(project);
        noteRepository.save(note);
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
    public NoteContent newContent(String text) {
        return new NoteContent(text);
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

        deleteESDocumentIds.add(ESUtil.getProjectItemSearchIndexId(note));
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void setColor(String requester, Long noteId, String color) {
        Note note = this.getProjectItem(noteId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(note.getOwner(), requester, ContentType.NOTE,
                Operation.UPDATE, noteId, note.getProject().getOwner());
        note.setColor(color);
        this.noteRepository.save(note);
    }

    private static final String[] MONTHS = {"January", "February", "March"};
    private static final String[] MONTH_COLORS = {
            "{\"r\":238,\"g\":207,\"b\":187,\"a\":1}",
            "{\"r\":246,\"g\":185,\"b\":157,\"a\":1}",
            "{\"r\":203,\"g\":138,\"b\":144,\"a\":1}"};

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void createSampleNotes(
            String username, Project noteProject) {
        List<com.bulletjournal.controller.models.Note> notes = new ArrayList<>();
        Note note = this.create(noteProject.getId(), username, new CreateNoteParams("Diary"));
        this.setColor(username, note.getId(), "{\"r\":250,\"g\":240,\"b\":228,\"a\":1}");
        notes.add(note.toPresentationModel());
        for (int i = 0; i < MONTHS.length; i++) {
            String month = MONTHS[i];
            note = this.create(noteProject.getId(), username, new CreateNoteParams(month));
            this.setColor(username, note.getId(), MONTH_COLORS[i]);
            notes.get(0).addSubNote(note.toPresentationModel());
            for (int j = 1; j <= 3; j++) {
                note = this.create(noteProject.getId(), username, new CreateNoteParams(Integer.toString(i + 1) + "-" + j));
                notes.get(0).getSubNotes().get(i).addSubNote(note.toPresentationModel());
            }
        }

        this.updateUserNotes(noteProject.getId(), notes, username);
    }
}
