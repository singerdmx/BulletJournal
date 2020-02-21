package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateNoteParams;
import com.bulletjournal.controller.models.Note;
import com.bulletjournal.controller.models.UpdateNoteParams;
import com.bulletjournal.repository.NoteDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class NoteController {

    protected static final String NOTES_ROUTE = "/api/projects/{projectId}/notes";
    protected static final String NOTE_ROUTE = "/api/notes/{noteId}";

    @Autowired
    private NoteDaoJpa noteDaoJpa;
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(NOTES_ROUTE)
    public List<Note> getNotes(@NotNull @PathVariable Long projectId) {
        return this.noteDaoJpa.getNotes(projectId).stream().map(t -> t.toPresentationModel()).collect(Collectors.toList());
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(NOTES_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Note createNote(@NotNull @PathVariable Long projectId,
                           @Valid @RequestBody CreateNoteParams note) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return noteDaoJpa.create(projectId, username, note).toPresentationModel();
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PatchMapping(NOTE_ROUTE)
    public Note updateNote(@NotNull @PathVariable Long noteId,
                           @Valid @RequestBody UpdateNoteParams updateNoteParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.noteDaoJpa.partialUpdate(username, noteId, updateNoteParams).toPresentationModel();
    }
}