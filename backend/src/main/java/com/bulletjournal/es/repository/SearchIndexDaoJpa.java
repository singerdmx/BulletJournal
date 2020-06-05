package com.bulletjournal.es.repository;

import com.bulletjournal.es.repository.models.SearchIndex;
import com.bulletjournal.repository.UserGroupRepository;
import com.bulletjournal.repository.UserRepository;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Repository;

import java.util.List;
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
    private UserGroupRepository userGroupRepository;

    @Autowired
    private UserRepository userRepository;


    private ElasticsearchOperations elasticsearchOperations;

    public SearchIndexDaoJpa(ElasticsearchOperations elasticsearchOperations) {
        this.elasticsearchOperations = elasticsearchOperations;
    }

    public SearchHits<SearchIndex> search(String username, String term) {
        List<Long> groupIdList = getUserGroups(username);

        BoolQueryBuilder queryBuilder = new BoolQueryBuilder();
        for (long groupId : groupIdList) {
            queryBuilder.should(QueryBuilders.termQuery("groupId", groupId));
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

        NativeSearchQuery query = new NativeSearchQueryBuilder().withQuery(queryBuilder).withHighlightBuilder(highlightBuilder).build();
         return elasticsearchOperations.search(query, SearchIndex.class);
    }

    public List<Long> getUserGroups(String username) {
        List<User> userList = this.userRepository.findByName(username);
        List<Long> userIdList = userList.stream().map(User::getId).collect(Collectors.toList());
        return this.userGroupRepository
                .findAllByUserId(userIdList.get(0))
                .stream()
                .map(UserGroup::getGroup)
                .map(Group::getId)
                .collect(Collectors.toList());
    }


}
