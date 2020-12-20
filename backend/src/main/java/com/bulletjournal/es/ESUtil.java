package com.bulletjournal.es;

import static com.bulletjournal.es.repository.SearchIndexDaoJpa.SEARCH_INDEX_SPLITTER;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.SearchResult;
import com.bulletjournal.controller.models.SearchResultItem;
import com.bulletjournal.repository.models.ProjectItemModel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

public class ESUtil {
    private static final String SCROLL_ID = "unit-test-scroll-id";
    private static final int TOTAL_HITS_BOUNDARY = 1000;

    /**
     * Return projectItem's search index id
     *
     * @param projectItem target projectItem
     * @return String- projectItem id in search index format
     */
    public static <T extends ProjectItemModel> String getProjectItemSearchIndexId(T projectItem) {
        return projectItem.getContentType().toString().toLowerCase() + SEARCH_INDEX_SPLITTER + projectItem.getId();
    }

    public static List<String> getProjectItemSearchIndexIds(List<Long> ids, ContentType contentType) {
        String s = contentType.toString().toLowerCase();
        return ids.stream().map(id -> s + SEARCH_INDEX_SPLITTER + id).collect(Collectors.toList());
    }

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
            note.setNameHighlights(Collections.singletonList("The quick brown <em class= 'highlight'>fox</em> jumps over the lazy dog"));
            note.setContentHighlights(Collections.singletonList("The quick brown <em class= 'highlight'>fox</em> jumps over the lazy dog"));
            mockList.add(note);
        }


        return mockList;
    }
}
