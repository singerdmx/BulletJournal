package com.bulletjournal.hierarchy;

import com.bulletjournal.controller.models.Note;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.*;

public class NoteRelationsProcessor {

    private static final String SUB_NOTES_KEY = "subNotes";
    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();

    public static String processRelations(List<Note> notes) {
        String jsonString = GSON.toJson(notes);
        // replace "subNotes" with "s" to save space
        return jsonString.replace(SUB_NOTES_KEY, HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT);
    }
}