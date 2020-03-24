package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveNoteEvent;
import com.bulletjournal.repository.NoteDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class NoteController {

    protected static final String NOTES_ROUTE = "/api/projects/{projectId}/notes";
    protected static final String NOTE_ROUTE = "/api/notes/{noteId}";
    protected static final String NOTE_SET_LABELS_ROUTE = "/api/notes/{noteId}/setLabels";
    protected static final String MOVE_NOTE_ROUTE = "/api/notes/{noteId}/move";
    protected static final String SHARE_NOTE_ROUTE = "/api/notes/{noteId}/share";

    @Autowired
    private NoteDaoJpa noteDaoJpa;

    @Autowired
    private NotificationService notificationService;

    @GetMapping(NOTES_ROUTE)
    public ResponseEntity<List<Note>> getNotes(@NotNull @PathVariable Long projectId) {
        List<Note> notes = this.noteDaoJpa.getNotes(projectId);
        String notesEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, notes);

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(notesEtag);

        return ResponseEntity.ok().headers(responseHeader).body(notes);
    }

    @PostMapping(NOTES_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Note createNote(@NotNull @PathVariable Long projectId,
                           @Valid @RequestBody CreateNoteParams note) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return noteDaoJpa.create(projectId, username, note).toPresentationModel();
    }

    @GetMapping(NOTE_ROUTE)
    public Note getNote(@NotNull @PathVariable Long noteId) {
        return this.noteDaoJpa.getNote(noteId);
    }

    @PatchMapping(NOTE_ROUTE)
    public ResponseEntity<List<Note>> updateNote(@NotNull @PathVariable Long noteId,
                           @Valid @RequestBody UpdateNoteParams updateNoteParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Note note = this.noteDaoJpa.partialUpdate(username, noteId, updateNoteParams).toPresentationModel();
        return getNotes(note.getProjectId());
    }

    @DeleteMapping(NOTE_ROUTE)
    public ResponseEntity<List<Note>> deleteNote(@NotNull @PathVariable Long noteId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Note note = getNote(noteId);
        List<Event> events = this.noteDaoJpa.deleteNote(username, noteId);
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveNoteEvent(events, username));
        }
        return getNotes(note.getProjectId());
    }

    @PutMapping(NOTES_ROUTE)
    public ResponseEntity<List<Note>> updateNoteRelations(@NotNull @PathVariable Long projectId, @Valid @RequestBody List<Note> notes) {
        this.noteDaoJpa.updateUserNotes(projectId, notes);
        return getNotes(projectId);
    }

    @PutMapping(NOTE_SET_LABELS_ROUTE)
    public Note setLabels(@NotNull @PathVariable Long noteId,
                          @NotNull @RequestBody List<Long> labels) {
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
    public String shareNote(
            @NotNull @PathVariable Long noteId,
            @NotNull @RequestBody ShareProjectItemParams shareProjectItemParams) {
        return null; // may be generated link
    }
}