package com.bulletjournal.es.repository;

import com.bulletjournal.config.SpringESConfig;
import com.bulletjournal.es.repository.models.SearchIndex;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.User;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
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
    private static final String PRE_TAG = "<em classname= 'highlight'>";
    private static final String POST_TAG = "</em>";
    private static final String BOUNDARY_SCANNER_TYPE = "sentence";
    private static final String HIGHLIGHTER_TYPE = "unified";
    private static final String SEARCH_FIELD = "value";
    private static final String FRAGMENTER = "span";

    private static final Integer FRAGMENT_SIZE = 300;
    private static final Integer NUM_OF_FRAGMENTS = 1;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private ElasticsearchRestTemplate elasticsearchRestTemplate;

    @Autowired
    private SpringESConfig springESConfig;

    public SearchScrollHits<SearchIndex> search(String username, String term) {
        List<Long> projectIdList = getUserProjects(username);

        BoolQueryBuilder queryBuilder = new BoolQueryBuilder();
        for (long pid : projectIdList) {
            queryBuilder.should(QueryBuilders.termQuery("projectId", pid));
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
                .withPageable(PageRequest.of(springESConfig.getPage(), springESConfig.getSize()))
                .build();
        SearchScrollHits<SearchIndex> scroll = elasticsearchRestTemplate.searchScrollStart(3600000,
                query, SearchIndex.class, IndexCoordinates.of("project_items"));

        return scroll;
    }

    public SearchScrollHits<SearchIndex> search(String scrollId) {
        return elasticsearchRestTemplate.searchScrollContinue(scrollId,
                3600000, SearchIndex.class, IndexCoordinates.of("project_items"));
    }

    private List<Long> getUserProjects(String username) {
        final Set<Long> set = new HashSet<>();
        User user = this.userDaoJpa.getByName(username);
        user.getGroups().stream().filter(u -> u.isAccepted()).forEach((u) -> set.addAll(
                u.getGroup().getProjects().stream()
                        .filter(p -> !p.isShared())
                        .map(p -> p.getId()).collect(Collectors.toList())));
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
}
