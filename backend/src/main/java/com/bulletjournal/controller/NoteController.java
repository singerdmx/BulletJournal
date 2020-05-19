package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.es.SearchService;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.notifications.Auditable;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.Informed;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveNoteEvent;
import com.bulletjournal.repository.NoteDaoJpa;
import com.bulletjournal.repository.models.ContentModel;
import com.bulletjournal.repository.models.NoteContent;
import com.bulletjournal.repository.models.ProjectItemModel;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.IF_NONE_MATCH;

@RestController
public class NoteController {

    protected static final String NOTES_ROUTE = "/api/projects/{projectId}/notes";
    protected static final String NOTE_ROUTE = "/api/notes/{noteId}";
    protected static final String NOTE_SET_LABELS_ROUTE = "/api/notes/{noteId}/setLabels";
    protected static final String MOVE_NOTE_ROUTE = "/api/notes/{noteId}/move";
    protected static final String SHARE_NOTE_ROUTE = "/api/notes/{noteId}/share";
    protected static final String GET_SHARABLES_ROUTE = "/api/notes/{noteId}/sharables";
    protected static final String REVOKE_SHARABLE_ROUTE = "/api/notes/{noteId}/revokeSharable";
    protected static final String ADD_CONTENT_ROUTE = "/api/notes/{noteId}/addContent";
    protected static final String CONTENT_ROUTE = "/api/notes/{noteId}/contents/{contentId}";
    protected static final String CONTENTS_ROUTE = "/api/notes/{noteId}/contents";
    protected static final String CONTENT_REVISIONS_ROUTE = "/api/notes/{noteId}/contents/{contentId}/revisions/{revisionId}";

    @Autowired
    private NoteDaoJpa noteDaoJpa;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserClient userClient;

    @Autowired
    private SearchService searchService;

    @GetMapping(NOTES_ROUTE)
    public ResponseEntity<List<Note>> getNotes(@NotNull @PathVariable Long projectId,
            @RequestParam(required = false) String owner, @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate, @RequestParam(required = false) Boolean order,
            @RequestParam(required = false) String timezone) {
        if (StringUtils.isNotBlank(owner)) {
            return getNotesByOwner(projectId, owner);
        }
        if (Boolean.TRUE.equals(order)) {
            return getNotesByOrder(projectId, startDate, endDate, timezone);
        }

        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Note> notes = this.noteDaoJpa.getNotes(projectId, username);
        String notesEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, notes);

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(notesEtag);

        return ResponseEntity.ok().headers(responseHeader)
                .body(notes.stream().map(n -> addAvatar(n)).collect(Collectors.toList()));
    }

    private ResponseEntity<List<Note>> getNotesByOwner(Long projectId, String owner) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Note> notes = this.noteDaoJpa.getNotesByOwner(projectId, username, owner);
        return ResponseEntity.ok().body(notes.stream().map(t -> addAvatar(t)).collect(Collectors.toList()));
    }

    private ResponseEntity<List<Note>> getNotesByOrder(Long projectId, String startDate, String endDate,
            String timezone) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Note> notes = this.noteDaoJpa.getNotesByOrder(projectId, username, startDate, endDate, timezone);
        return ResponseEntity.ok().body(notes.stream().map(t -> addAvatar(t)).collect(Collectors.toList()));
    }

    private Note addAvatar(Note note) {
        note.setOwnerAvatar(this.userClient.getUser(note.getOwner()).getAvatar());
        if (note.getSubNotes() != null) {
            for (Note subNote : note.getSubNotes()) {
                addAvatar(subNote);
            }
        }
        return note;
    }

    @PostMapping(NOTES_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Note createNote(@NotNull @PathVariable Long projectId, @Valid @RequestBody CreateNoteParams note) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Pair<com.bulletjournal.repository.models.Note, com.bulletjournal.repository.models.Project> res = noteDaoJpa
                .create(projectId, username, note);
        Note createdNote = res.getLeft().toPresentationModel();
        String projectName = res.getRight().getName();
        searchService.saveToES(createdNote);

        this.notificationService.trackActivity(new Auditable(projectId,
                "created Note ##" + createdNote.getName() + "## in BuJo ##" + projectName + "##", username,
                createdNote.getId(), Timestamp.from(Instant.now()), ContentAction.ADD_NOTE));
        return createdNote;
    }

    @GetMapping(NOTE_ROUTE)
    public Note getNote(@NotNull @PathVariable Long noteId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return addAvatar(this.noteDaoJpa.getNote(username, noteId));
    }

    @PatchMapping(NOTE_ROUTE)
    public ResponseEntity<List<Note>> updateNote(@NotNull @PathVariable Long noteId,
            @Valid @RequestBody UpdateNoteParams updateNoteParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        com.bulletjournal.repository.models.Note updatedNote = this.noteDaoJpa.partialUpdate(username, noteId,
                updateNoteParams);
        Note note = updatedNote.toPresentationModel();
        String projectName = updatedNote.getProject().getName();
        this.notificationService.trackActivity(new Auditable(note.getProjectId(),
                "updated note ##" + note.getName() + "## in BuJo " + projectName + "##", username, noteId,
                Timestamp.from(Instant.now()), ContentAction.UPDATE_NOTE));
        return getNotes(note.getProjectId(), null, null, null, null, null);
    }

    @DeleteMapping(NOTE_ROUTE)
    public ResponseEntity<List<Note>> deleteNote(@NotNull @PathVariable Long noteId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Note note = getNote(noteId);
        Pair<List<Event>, com.bulletjournal.repository.models.Note> res = this.noteDaoJpa.deleteNote(username, noteId);
        List<Event> events = res.getLeft();
        Long projectId = res.getRight().getProject().getId();
        String noteName = res.getRight().getName();

        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveNoteEvent(events, username));
        }
        this.notificationService.trackActivity(new Auditable(projectId, "deleted note ##" + noteName + "##", username,
                noteId, Timestamp.from(Instant.now()), ContentAction.DELETE_NOTE));
        return getNotes(note.getProjectId(), null, null, null, null, null);
    }

    @PutMapping(NOTES_ROUTE)
    public ResponseEntity<List<Note>> updateNoteRelations(@NotNull @PathVariable Long projectId,
            @Valid @RequestBody List<Note> notes, @RequestHeader(IF_NONE_MATCH) Optional<String> notesEtag) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        if (notesEtag.isPresent()) {
            List<Note> noteList = this.noteDaoJpa.getNotes(projectId, username);
            String expectedEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE, noteList);
            if (!Objects.equals(expectedEtag, notesEtag.get())) {
                throw new BadRequestException("Invalid Etag");
            }
        }
        this.noteDaoJpa.updateUserNotes(projectId, notes);
        return getNotes(projectId, null, null, null, null, null);
    }

    @PutMapping(NOTE_SET_LABELS_ROUTE)
    public Note setLabels(@NotNull @PathVariable Long noteId, @NotNull @RequestBody List<Long> labels) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.notificationService.inform(this.noteDaoJpa.setLabels(username, noteId, labels));
        return getNote(noteId);
    }

    @PostMapping(MOVE_NOTE_ROUTE)
    public void moveNote(@NotNull @PathVariable Long noteId,
            @NotNull @RequestBody MoveProjectItemParams moveProjectItemParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.noteDaoJpa.move(username, noteId, moveProjectItemParams.getTargetProject());
    }

    @PostMapping(SHARE_NOTE_ROUTE)
    public SharableLink shareNote(@NotNull @PathVariable Long noteId,
            @NotNull @RequestBody ShareProjectItemParams shareProjectItemParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        if (shareProjectItemParams.isGenerateLink()) {
            return this.noteDaoJpa.generatePublicItemLink(noteId, username, shareProjectItemParams.getTtl());
        }

        Informed inform = this.noteDaoJpa.shareProjectItem(noteId, shareProjectItemParams, username);
        this.notificationService.inform(inform);
        return null;
    }

    @GetMapping(GET_SHARABLES_ROUTE)
    public ProjectItemSharables getSharables(@NotNull @PathVariable Long noteId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        ProjectItemSharables result = this.noteDaoJpa.getSharables(noteId, username);
        List<User> users = result.getUsers().stream().map((u) -> this.userClient.getUser(u.getName()))
                .collect(Collectors.toList());
        result.setUsers(users);
        return result;
    }

    @PostMapping(REVOKE_SHARABLE_ROUTE)
    public void revokeSharable(@NotNull @PathVariable Long noteId,
            @NotNull @RequestBody RevokeProjectItemSharableParams revokeProjectItemSharableParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.noteDaoJpa.revokeSharable(noteId, username, revokeProjectItemSharableParams);
    }

    @PostMapping(ADD_CONTENT_ROUTE)
    public Content addContent(@NotNull @PathVariable Long noteId,
            @NotNull @RequestBody CreateContentParams createContentParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        Pair<ContentModel, ProjectItemModel> res = this.noteDaoJpa.addContent(noteId, username,
                new NoteContent(createContentParams.getText()));

        Content createdContent = res.getLeft().toPresentationModel();
        String noteName = res.getRight().getName();
        Long projectId = res.getRight().getProject().getId();
        String projectName = res.getRight().getProject().getName();

        this.notificationService.trackActivity(new Auditable(projectId,
                "created Content in Note ##" + noteName + "## under BuJo ##" + projectName + "##", username, noteId,
                Timestamp.from(Instant.now()), ContentAction.ADD_NOTE_CONTENT));

        return createdContent;
    }

    @GetMapping(CONTENTS_ROUTE)
    public List<Content> getContents(@NotNull @PathVariable Long noteId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.noteDaoJpa.getContents(noteId, username).stream().map(t -> {
            Content content = t.toPresentationModel();
            content.setOwnerAvatar(this.userClient.getUser(content.getOwner()).getAvatar());
            for (Revision revision : content.getRevisions()) {
                revision.setUserAvatar(this.userClient.getUser(revision.getUser()).getAvatar());
            }
            return content;
        }).collect(Collectors.toList());
    }

    @DeleteMapping(CONTENT_ROUTE)
    public List<Content> deleteContent(@NotNull @PathVariable Long noteId, @NotNull @PathVariable Long contentId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        ProjectItemModel note = this.noteDaoJpa.deleteContent(contentId, noteId, username);

        this.notificationService.trackActivity(new Auditable(note.getProject().getId(),
                "deleted Content in Note ##" + note.getName() + "## under BuJo ##" + note.getProject().getName() + "##",
                username, noteId, Timestamp.from(Instant.now()), ContentAction.DELETE_NOTE_CONTENT));

        return getContents(noteId);
    }

    @PatchMapping(CONTENT_ROUTE)
    public List<Content> updateContent(@NotNull @PathVariable Long noteId, @NotNull @PathVariable Long contentId,
            @NotNull @RequestBody UpdateContentParams updateContentParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        ProjectItemModel note = this.noteDaoJpa.updateContent(contentId, noteId, username, updateContentParams)
                .getRight();

        this.notificationService.trackActivity(new Auditable(note.getProject().getId(),
                "updated Content in Note ##" + note.getName() + "## under BuJo ##" + note.getProject().getName() + "##",
                username, noteId, Timestamp.from(Instant.now()), ContentAction.UPDATE_NOTE_CONTENT));

        return getContents(noteId);
    }

    @GetMapping(CONTENT_REVISIONS_ROUTE)
    public Revision getContentRevision(@NotNull @PathVariable Long noteId, @NotNull @PathVariable Long contentId,
            @NotNull @PathVariable Long revisionId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Revision revision = this.noteDaoJpa.getContentRevision(username, noteId, contentId, revisionId);
        revision.setUserAvatar(this.userClient.getUser(revision.getUser()).getAvatar());
        return revision;
    }
}