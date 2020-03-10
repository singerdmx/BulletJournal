package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateNoteParams;
import com.bulletjournal.controller.models.Note;
import com.bulletjournal.controller.models.UpdateNoteParams;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveNoteEvent;
import com.bulletjournal.repository.NoteDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
public class NoteController {

    protected static final String NOTES_ROUTE = "/api/projects/{projectId}/notes";
    protected static final String NOTE_ROUTE = "/api/notes/{noteId}";

    @Autowired
    private NoteDaoJpa noteDaoJpa;

    @Autowired
    private NotificationService notificationService;

    @GetMapping(NOTES_ROUTE)
    public List<Note> getNotes(@NotNull @PathVariable Long projectId) {
        return this.noteDaoJpa.getNotes(projectId);
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
        return this.noteDaoJpa.getNote(noteId).toPresentationModel();
    }

    @PatchMapping(NOTE_ROUTE)
    public Note updateNote(@NotNull @PathVariable Long noteId,
                           @Valid @RequestBody UpdateNoteParams updateNoteParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.noteDaoJpa.partialUpdate(username, noteId, updateNoteParams).toPresentationModel();
    }

    @DeleteMapping(NOTE_ROUTE)
    public void deleteNote(@NotNull @PathVariable Long noteId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = this.noteDaoJpa.deleteNote(username, noteId);
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveNoteEvent(events, username));
        }
    }

    @PutMapping(NOTES_ROUTE)
    public void updateNoteRelations(@NotNull @PathVariable Long projectId, @Valid @RequestBody List<Note> notes) {
        this.noteDaoJpa.updateUserNotes(projectId, notes);
    }

}