package com.bulletjournal.es;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.SearchResult;
import com.bulletjournal.controller.models.SearchResultItem;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ESUtil {
    private static final long TOTAL_HITS = 3;
    private static final String SCROLL_ID = "unit-test-scroll-id";

    public static SearchResult createMockSearchResult() {
        SearchResult mockData = new SearchResult();
        mockData.setScrollId(SCROLL_ID);
        mockData.setTotalHits(TOTAL_HITS);
        mockData.setSearchResultItemList(createMockSearchResultItemList());
        return mockData;
    }

    private static List<SearchResultItem> createMockSearchResultItemList() {
        List<SearchResultItem> mockList = new ArrayList<>();
        SearchResultItem note = new SearchResultItem();
        note.setId(100L);
        note.setType(ContentType.NOTE);
        note.setName("Note1");
        note.setNameHighlights(Collections.singletonList("<em classname= 'highlight'>Note1</em>"));
        note.setContentHighlights(Collections.singletonList("<em classname= 'highlight'>Note1</em>"));
        mockList.add(note);

        SearchResultItem task = new SearchResultItem();
        task.setId(8L);
        task.setType(ContentType.TASK);
        task.setName("task8");
        task.setNameHighlights(Collections.singletonList("<em classname= 'highlight'>task8</em>"));
        task.setContentHighlights(Collections.singletonList("<em classname= 'highlight'>task8</em>"));
        mockList.add(task);

        SearchResultItem transaction = new SearchResultItem();
        transaction.setId(8L);
        transaction.setType(ContentType.TRANSACTION);
        transaction.setName("Payment8");
        transaction.setNameHighlights(Collections.singletonList("<em classname= 'highlight'>Payment8</em>"));
        transaction.setContentHighlights(Collections.singletonList("<em classname= 'highlight'>Payment8</em>"));
        mockList.add(transaction);

        return mockList;
    }
}
