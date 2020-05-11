package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.es.SearchService;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.Informed;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveNoteEvent;
import com.bulletjournal.repository.NoteDaoJpa;
import com.bulletjournal.repository.models.NoteContent;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.lang3.StringUtils;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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
            @RequestParam(required = false) String owner) {
        if (StringUtils.isNotBlank(owner)) {
            return getNotesByOwner(projectId, owner);
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
        Note createdNote = noteDaoJpa.create(projectId, username, note).toPresentationModel();
        searchService.saveToES(createdNote);
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
        Note note = this.noteDaoJpa.partialUpdate(username, noteId, updateNoteParams).toPresentationModel();
        return getNotes(note.getProjectId(), null);
    }

    @DeleteMapping(NOTE_ROUTE)
    public ResponseEntity<List<Note>> deleteNote(@NotNull @PathVariable Long noteId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Note note = getNote(noteId);
        List<Event> events = this.noteDaoJpa.deleteNote(username, noteId);
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveNoteEvent(events, username));
        }
        return getNotes(note.getProjectId(), null);
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
        return getNotes(projectId, null);
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
        return this.noteDaoJpa.addContent(noteId, username, new NoteContent(createContentParams.getText()))
                .toPresentationModel();
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
        this.noteDaoJpa.deleteContent(contentId, noteId, username);
        return getContents(noteId);
    }

    @PatchMapping(CONTENT_ROUTE)
    public List<Content> updateContent(@NotNull @PathVariable Long noteId, @NotNull @PathVariable Long contentId,
            @NotNull @RequestBody UpdateContentParams updateContentParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.noteDaoJpa.updateContent(contentId, noteId, username, updateContentParams);
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