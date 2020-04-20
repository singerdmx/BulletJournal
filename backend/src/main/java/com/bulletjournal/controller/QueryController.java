package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.es.SearchService;
import com.bulletjournal.repository.GroupDaoJpa;
import com.bulletjournal.repository.UserGroupRepository;
import com.bulletjournal.repository.UserRepository;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@RestController
public class QueryController {

    protected static final String SEARCH_ROUTE = "/api/query";

    private static final Logger LOGGER = LoggerFactory.getLogger(NoteController.class);

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    UserGroupRepository userGroupRepository;

    @Qualifier("client")
    @Autowired(required = false)
    private RestHighLevelClient highLevelClient;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(SEARCH_ROUTE)
    @ResponseStatus(HttpStatus.OK)
    public SearchResponse searchItems(@Valid @RequestParam @NotBlank String term) throws IOException {

        if (highLevelClient == null) {
            LOGGER.info("ES is not enabled.");
            return null;
        }

        // TODO return List<ProjectItems>
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<User> userList = this.userRepository.findByName(username);
        List<Long> userIdList = userList.stream().map(User::getId).collect(Collectors.toList());
        List<Long> groupIdList = userGroupRepository.findAllByUserId(userIdList.get(0))
                .stream().map(UserGroup::getGroup).map(Group::getId).collect(Collectors.toList());

        SearchRequest searchRequest = new SearchRequest(SearchService.PROJECT_ITEM);
        searchRequest.source(new SearchSourceBuilder().query(
                QueryBuilders.boolQuery()
                        .filter(QueryBuilders.termsQuery("group_id", groupIdList))
                        .must(QueryBuilders.matchQuery("project_item_name", term)
                                .fuzziness(Fuzziness.AUTO)
                                .prefixLength(3)
                                .maxExpansions(10))

        ));

        SearchResponse response = highLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        LOGGER.info(response.toString());
        return response;
    }
}
