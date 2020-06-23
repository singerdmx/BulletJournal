package com.bulletjournal.controller.models;

import java.util.ArrayList;
import java.util.List;

public class SearchResult {

    private Long totalHits;
    private Boolean hasSearchHits;
    private String scrollId;
    private List<SearchResultItem> searchResultItemList = new ArrayList<>();

    public SearchResult() {
    }

    public Long getTotalHits() {
        return totalHits;
    }

    public void setTotalHits(Long totalHits) {
        this.totalHits = totalHits;
    }

    public String getScrollId() {
        return scrollId;
    }

    public void setScrollId(String scrollId) {
        this.scrollId = scrollId;
    }

    public List<SearchResultItem> getSearchResultItemList() {
        return searchResultItemList;
    }

    public void setSearchResultItemList(List<SearchResultItem> searchResultItemList) {
        this.searchResultItemList = searchResultItemList;
    }

    public Boolean getHasSearchHits() {
        return hasSearchHits;
    }

    public void setHasSearchHits(Boolean hasSearchHits) {
        this.hasSearchHits = hasSearchHits;
    }
}
