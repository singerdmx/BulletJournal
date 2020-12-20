package com.bulletjournal.es.repository;

import com.bulletjournal.config.SpringESConfig;
import com.bulletjournal.es.repository.models.SearchIndex;
import com.bulletjournal.notifications.RemoveElasticsearchDocumentEvent;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.*;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchScrollHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class SearchIndexDaoJpa {
    public static final char SEARCH_INDEX_SPLITTER = '@';
    private static final Logger LOGGER = LoggerFactory.getLogger(SearchIndexDaoJpa.class);
    private static final String PRE_TAG = "<em class='highlight'>";
    private static final String POST_TAG = "</em>";
    private static final String BOUNDARY_SCANNER_TYPE = "sentence";
    private static final String HIGHLIGHTER_TYPE = "plain";
    private static final String SEARCH_FIELD = "value";
    private static final String FRAGMENTER = "span";
    private static final String SEARCH_INDEX_NAME = "project_items";
    private static final String CONTENT_TYPE_SUFFIX = "_content";
    private static final String PROJECT_ID = "projectId";


    private static final Integer FRAGMENT_SIZE = 300;
    private static final Integer NUM_OF_FRAGMENTS = 1;
    private static final long SCROLL_TIME_IN_MILLIS = 3600000;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private ElasticsearchRestTemplate elasticsearchRestTemplate;

    @Autowired
    private SpringESConfig springESConfig;

    /**
     * Search term in ElasticSearch Database. Initialize search pagination with requested page number
     * and page size.
     * <p>
     * Return the search results appeared first page, scrollId and total hits.
     *
     * @param username requested username
     * @param term     search term
     * @param pageNo   the page number
     * @param pageSize the record count in one page
     * @return SearchScrollHits contains the search results
     */
    public SearchScrollHits<SearchIndex> search(String username, String term, List<String> sharedItemIds,
                                                int pageNo, int pageSize) {
        List<Long> projectIdList = getUserProjects(username);

        BoolQueryBuilder queryBuilder = new BoolQueryBuilder();
        for (long pid : projectIdList) {
            queryBuilder.should(QueryBuilders.termQuery(PROJECT_ID, pid));
        }

        for (String shareItemId : sharedItemIds) {
            queryBuilder.should(QueryBuilders.termQuery("id", shareItemId));
        }
        queryBuilder.minimumShouldMatch(1)
                .must(QueryBuilders.matchQuery(SEARCH_FIELD, term)
                        .fuzziness(Fuzziness.AUTO)
                        .prefixLength(3)
                        .maxExpansions(10));

        HighlightBuilder highlightBuilder = new HighlightBuilder();
        highlightBuilder.preTags(PRE_TAG).postTags(POST_TAG)
                .boundaryScannerType(BOUNDARY_SCANNER_TYPE)
                .fragmenter(FRAGMENTER)
                .field(SEARCH_FIELD)
                .fragmentSize(FRAGMENT_SIZE)
                .numOfFragments(NUM_OF_FRAGMENTS).highlighterType(HIGHLIGHTER_TYPE);

        NativeSearchQuery query = new NativeSearchQueryBuilder()
                .withQuery(queryBuilder)
                .withHighlightBuilder(highlightBuilder)
                .withPageable(PageRequest.of(pageNo, pageSize))
                .build();

        return elasticsearchRestTemplate.searchScrollStart(SCROLL_TIME_IN_MILLIS,
                query,
                SearchIndex.class,
                IndexCoordinates.of(SEARCH_INDEX_NAME));
    }

    /**
     * Search results in next page with scrollId
     *
     * @param scrollId the scrollId for pagination
     * @return SearchScrollHits contains the search results
     */
    public SearchScrollHits<SearchIndex> search(String scrollId) {
        return elasticsearchRestTemplate.searchScrollContinue(scrollId,
                SCROLL_TIME_IN_MILLIS,
                SearchIndex.class,
                IndexCoordinates.of(SEARCH_INDEX_NAME));
    }

    /**
     * Get request user's projects
     *
     * @param username the requested user's username
     * @return a list of project Id
     */
    private List<Long> getUserProjects(String username) {
        final Set<Long> set = new HashSet<>();
        User user = this.userDaoJpa.getByName(username);
        user.getGroups().stream().filter(UserGroup::isAccepted).forEach((u) -> set.addAll(
                u.getGroup().getProjects().stream()
                        .filter(p -> !p.isShared())
                        .map(Project::getId).collect(Collectors.toList())));
        return new ArrayList<>(set);
    }

    /**
     * Delete target search index from elastic search jpa
     *
     * @param searchIndex target search index
     */
    private void deleteSearchIndex(SearchIndex searchIndex) {
        this.elasticsearchRestTemplate.delete(searchIndex);
    }

    /**
     * Delete a list of search indices through delete search index api
     *
     * @param searchIndices a list of search indices
     */
    public void deleteSearchIndices(List<SearchIndex> searchIndices) {
        searchIndices.forEach(this::deleteSearchIndex);
    }

    /**
     * Delete target document by id from elastic search jpa
     *
     * @param documentId target search index
     */
    public void deleteSearchIndexDocument(String documentId) {
        this.elasticsearchRestTemplate.delete(documentId, IndexCoordinates.of(SEARCH_INDEX_NAME));
    }

    /**
     * Delete target document by id from elastic search jpa
     *
     * @param documentIds target search index
     */
    public void deleteSearchIndexDocuments(List<String> documentIds) {
        for (String s : documentIds) {
            deleteSearchIndexDocument(s);
        }
    }

    /**
     * Delete target project by id from elastic search jpa
     *
     * @param projectId target search index
     */
    public void deleteSearchIndexProject(Long projectId) {
        QueryBuilder matchQuery = QueryBuilders.matchQuery(PROJECT_ID, projectId);
        NativeSearchQuery query = new NativeSearchQueryBuilder().withQuery(matchQuery).build();
        this.elasticsearchRestTemplate.delete(query, SearchIndex.class, IndexCoordinates.of(SEARCH_INDEX_NAME));
    }
    /**
     * Return content's search index id
     *
     * @param content target content
     * @return String- content id in search index format
     */
    public <K extends ContentModel> String getContentSearchIndexId(K content) {
        return content.getProjectItem().getContentType().toString().toLowerCase() +
                CONTENT_TYPE_SUFFIX + SEARCH_INDEX_SPLITTER + content.getId();
    }

    public void delete(List<RemoveElasticsearchDocumentEvent> events) {
        events.forEach(event -> this.deleteSearchIndexDocuments(event.getDocumentIds()));
    }
}
