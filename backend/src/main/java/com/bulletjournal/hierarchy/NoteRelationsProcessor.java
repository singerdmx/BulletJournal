package com.bulletjournal.hierarchy;

import com.bulletjournal.controller.models.Note;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class NoteRelationsProcessor {

    private static final String SUB_NOTES_KEY = "subNotes";
    private static final Gson GSON = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation().create();
    private static final Gson HIERARCHY_ITEM_GSON = new Gson();

    public static List<Note> processRelations(Map<Long, com.bulletjournal.repository.models.Note> noteMap,
                                              List<HierarchyItem> relations) {
        return processRelations(noteMap, HIERARCHY_ITEM_GSON.toJson(relations));
    }

    private static List<Note> processRelations(
            Map<Long, com.bulletjournal.repository.models.Note> noteMap, String relations) {
        Note[] list = GSON.fromJson(
                relations.replace(HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT, SUB_NOTES_KEY), Note[].class);
        List<Note> notes = new ArrayList<>();
        for (Note note : list) {
            notes.add(merge(noteMap, note));
        }
        return notes;
    }

    private static Note merge(Map<Long, com.bulletjournal.repository.models.Note> noteMap, Note cur) {
        cur.clone(noteMap.get(cur.getId()).toPresentationModel());
        for (Note subNote : cur.getSubNotes()) {
            merge(noteMap, subNote);
        }
        return cur;
    }

    public static String processRelations(List<Note> notes) {
        String jsonString = GSON.toJson(notes);
        // replace "subNotes" with "s" to save space
        return jsonString.replace(SUB_NOTES_KEY, HierarchyItem.SUB_ITEMS_KEY_REPLACEMENT);
    }
}