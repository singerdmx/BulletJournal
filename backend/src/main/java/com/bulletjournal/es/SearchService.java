package com.bulletjournal.es;

import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.es.repository.models.SearchIndex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    public static final String PROJECT_ITEM = "project_items";

    private static final Logger LOGGER = LoggerFactory.getLogger(SearchService.class);

    @Autowired
    private SearchIndexDaoJpa searchIndexDaoJpa;

    /**
     * Remove invalid search indices from elastic search container
     *
     * @param searchIndices a list of search indices
     */
    public void removeInvalidSearchResults(List<SearchIndex> searchIndices) {
        if (searchIndices.size() == 0)
            return;

        this.searchIndexDaoJpa.deleteSearchIndices(searchIndices);
    }
}
