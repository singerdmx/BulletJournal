package com.bulletjournal.es;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.SearchResult;
import com.bulletjournal.controller.models.SearchResultItem;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class ESUtil {
    private static final String SCROLL_ID = "unit-test-scroll-id";
    private static final int TOTAL_HITS_BOUNDARY = 1000;


    public static SearchResult createMockSearchResult() {
        long totalHits = new Random().nextInt(TOTAL_HITS_BOUNDARY);

        SearchResult mockData = new SearchResult();
        mockData.setScrollId(SCROLL_ID);
        mockData.setTotalHits(totalHits);
        mockData.setHasSearchHits(!(new Random().nextDouble() > 0.5));
        mockData.setSearchResultItemList(createMockSearchResultItemList(totalHits));
        return mockData;
    }

    private static List<SearchResultItem> createMockSearchResultItemList(long totalHits) {
        List<SearchResultItem> mockList = new ArrayList<>();

        for (int i = 1; i <= totalHits; i++) {
            SearchResultItem note = new SearchResultItem();
            note.setId((long) i);
            note.setType(ContentType.NOTE);
            note.setName("Note" + i);
            note.setNameHighlights(Collections.singletonList("The quick brown <em classname= 'highlight'>fox</em> jumps over the lazy dog"));
            note.setContentHighlights(Collections.singletonList("The quick brown <em classname= 'highlight'>fox</em> jumps over the lazy dog"));
            mockList.add(note);
        }


        return mockList;
    }
}
