package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.SpringESConfig;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.SearchResult;
import com.bulletjournal.controller.models.SearchResultItem;
import com.bulletjournal.es.ESUtil;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.es.repository.models.SearchIndex;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveElasticsearchDocumentEvent;
import com.bulletjournal.redis.RedisShareItemIdRepository;
import com.bulletjournal.redis.models.ShareItemIds;
import com.bulletjournal.repository.*;
import com.bulletjournal.repository.models.ProjectItemModel;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchScrollHits;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class QueryController {

    protected static final String SEARCH_ROUTE = "/api/query";
    private static final Logger LOGGER = LoggerFactory.getLogger(QueryController.class);
    private static final String CONTENT_TYPE_SUFFIX = "content";
    private static final char SEARCH_INDEX_SPLITTER = '@';

    @Autowired
    private SearchIndexDaoJpa searchIndexDaoJpa;
    @Autowired
    private TaskDaoJpa taskDaoJpa;
    @Autowired
    private TransactionDaoJpa transactionDaoJpa;
    @Autowired
    private NoteDaoJpa noteDaoJpa;
    @Autowired
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;

    @Autowired
    private NoteContentRepository noteContentRepository;
    @Autowired
    private TaskContentRepository taskContentRepository;

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private SpringESConfig springESConfig;

    @Autowired
    private RedisShareItemIdRepository redisShareItemIdRepository;

    /**
     * Parse Search Index identifier into type and id
     *
     * @param searchIndexInfo search index information
     * @return a pair of type and id
     */
    private static Pair<String, Long> parseSearchIndexInfo(String searchIndexInfo) {
        String type = searchIndexInfo.substring(0, searchIndexInfo.indexOf(SEARCH_INDEX_SPLITTER));
        String id = searchIndexInfo.substring(searchIndexInfo.indexOf(SEARCH_INDEX_SPLITTER) + 1);

        if (StringUtils.isBlank(type) || StringUtils.isBlank(id)) {
            LOGGER.error("QueryController failed to parse search index information");
            throw new IllegalStateException("Search Index Format is wrong");
        }

        return Pair.of(type, Long.parseLong(id));
    }

    /**
     * [Query Controller Search API] (Fuzziness Search)
     * Search API takes a string of term and username to query results from Elastic Search JPA.
     * <p>
     * Validate search results before response. If result is invalid, remove search index from
     * elastic search database and skip this result in the response.
     * <p>
     * SearchResult Model Structure
     * - Long totalHits
     * - String ScrollId
     * - List[SearchResultItem] searchResultItemList
     * <p>
     * SearchResultItem Model Structure
     * - String ProjectItem Id
     * - String ProjectItem Type
     * - String ProjectItem Name
     * - List[String] HighLights of Name
     * - List[String] HighLights of Content
     *
     * @param scrollId user uses scroll id to get next page
     * @param term     user input term to be searched in Elastic Search DB
     * @param pageNo   user gives starting page number
     * @param pageSize user gives size for each search
     * @return a list of returned SearchResult. Search result contains id and matched highlights
     */
    @GetMapping(SEARCH_ROUTE)
    @ResponseStatus(HttpStatus.OK)
    public SearchResult search(@RequestParam(required = false) String scrollId,
                               @Valid @RequestParam @NotBlank String term,
                               @RequestParam(required = false, defaultValue = "0") Integer pageNo,
                               @RequestParam(required = false, defaultValue = "10") Integer pageSize) {

        if (!this.springESConfig.getEnable()) {
            return ESUtil.createMockSearchResult();
        }

        String username = MDC.get(UserClient.USER_NAME_KEY);
        SearchScrollHits<SearchIndex> scroll;
        ShareItemIds shareItemIds;
        if (scrollId == null || scrollId.length() == 0) {
            List<ProjectItemModel> projectItemModels = sharedProjectItemDaoJpa.
                    getSharedProjectItems(username, null);
            Map<ContentType, List<Long>> sharedContentIds = this.getContentIdsFromItems(projectItemModels);
            List<String> sharedProjectItemIds = generateSharedProjectItemIds(
                    projectItemModels, sharedContentIds);

            Map<ContentType, Set<Long>> projectItemIdMap = getProjectItemIds(sharedProjectItemIds);
            scroll = searchIndexDaoJpa.search(username, term, sharedProjectItemIds, pageNo, pageSize);
            scrollId = scroll.getScrollId();
            shareItemIds = new ShareItemIds(scrollId, projectItemIdMap.getOrDefault(ContentType.NOTE, Collections.emptySet()),
                    projectItemIdMap.getOrDefault(ContentType.TASK, Collections.emptySet()));
            redisShareItemIdRepository.save(shareItemIds);
        } else {
            scroll = searchIndexDaoJpa.search(scrollId);
            Optional<ShareItemIds> option = redisShareItemIdRepository.findById(scrollId);
            if (!option.isPresent()) {
                throw new IllegalStateException("ScrollId is not stored");
            }
            shareItemIds = option.get();
            scrollId = scroll.getScrollId();
            redisShareItemIdRepository.save(new ShareItemIds(
                    scrollId, shareItemIds.getSharedNoteIds(), shareItemIds.getSharedTaskIds()
            ));
        }

        if (scroll == null) {
            throw new IllegalStateException("SearchScrollHits is null");
        }

        List<SearchHit<SearchIndex>> searchResultList = new ArrayList<>();
        if (scroll.hasSearchHits()) {
            searchResultList.addAll(scroll.getSearchHits());
        }

        List<SearchIndex> invalidResults = new ArrayList<>();
        List<SearchResultItem> validResults = search(username, invalidResults, searchResultList,
                shareItemIds.getSharedNoteIds(), shareItemIds.getSharedTaskIds());

        // Batch remove all invalid results from ElasticSearch using notification event queue
        notificationService.deleteESDocument(new RemoveElasticsearchDocumentEvent(
                invalidResults.stream().map(SearchIndex::getId).collect(Collectors.toList())));

        SearchResult validSearchResult = new SearchResult();
        validSearchResult.setScrollId(scrollId);
        validSearchResult.setSearchResultItemList(validResults);
        validSearchResult.setTotalHits(scroll.getTotalHits());
        validSearchResult.setHasSearchHits(scroll.hasSearchHits());

        return validSearchResult;
    }

    // input: task 1, task 2, note 5, note 6
    // task 1 -> content 1 3
    // task 2 -> 5, 7
    // note 5 -> 1, 4
    // note 6 -> 7, 9, 10
    // => <ContentType.TASK, [1,2]>, <ContentType.NOTE, [5,6]>
    // => <ContentType.TASK, [1,3,5,7]>, <ContentType.NOTE, [1,4,7,9,10]>
    private Map<ContentType, List<Long>> getContentIdsFromItems(List<ProjectItemModel> projectItemModels) {
        Map<ContentType, List<Long>> m = new HashMap<>();
        projectItemModels.forEach(item ->
                m.computeIfAbsent(item.getContentType(), k -> new ArrayList<>()).add(item.getId()));
        m.forEach((k, v) -> {
            // item.getId() -> content ids
            switch (k) {
                case NOTE:
                    List<Long> noteContentIds = this.noteContentRepository.findAllByNoteIds(v);
                    v.clear();
                    v.addAll(noteContentIds);
                    break;
                case TASK:
                    List<Long> taskContentIds = this.taskContentRepository.findAllByTaskIds(v);
                    v.clear();
                    v.addAll(taskContentIds);
                    break;
                default:
            }
        });
        return m;
    }

    private List<String> generateSharedProjectItemIds(List<ProjectItemModel> items,
                                                      Map<ContentType, List<Long>> contents) {
        List<String> ret = new ArrayList<>();
        for (ProjectItemModel item : items) {
            ret.add(item.getContentType().name().toLowerCase() + SEARCH_INDEX_SPLITTER + item.getId());
        }

        contents.forEach((k, v) -> {
            for (Long id : v) {
                ret.add(k.name().toLowerCase() + "_content" + SEARCH_INDEX_SPLITTER + id);
            }
        });
        return ret;
    }

    private Map<ContentType, Set<Long>> getProjectItemIds(List<String> sharedProjectItemIds) {
        Map<ContentType, Set<Long>> m = new HashMap<>();
        sharedProjectItemIds.forEach(id -> {
                    int index = id.indexOf(SEARCH_INDEX_SPLITTER);
                     String contentType = id.substring(0, index).toUpperCase();
                    if (contentType.equals(ContentType.NOTE.name())
                            ||  contentType.equals(ContentType.TASK.name()))
                    m.computeIfAbsent(ContentType.valueOf(contentType), k -> new HashSet<>())
                            .add(Long.valueOf(id.substring(index + 1)));
                }
        );
        return m;
    }

    /**
     * Search requested term in elastic search and add invalid results to invalid list
     *
     * @param username         requester username
     * @param invalid          list of invalid search indices
     * @param searchResultList list of search result
     * @return a list of search results with unique id
     */
    private List<SearchResultItem> search(String username,
                                          List<SearchIndex> invalid,
                                          List<SearchHit<SearchIndex>> searchResultList,
                                          Set<Long> shareNoteIds, Set<Long> shareTaskIds) {
        if (shareNoteIds == null) {
            shareNoteIds = Collections.emptySet();
        }
        if (shareTaskIds == null) {
            shareTaskIds = Collections.emptySet();
        }
        final Set<Long> shareNotes = shareNoteIds;
        final Set<Long> shareTasks = shareTaskIds;
        // Created a Map to group search result to the same id
        Map<String, SearchResultItem> results = new HashMap<>();

        searchResultList.forEach(searchHit -> {
            SearchIndex index = searchHit.getContent();
            boolean isContent = index.getParentId() != null;
            String projectItemId = isContent ? index.getParentId() : index.getId();

            // If search result is not present in database, add result to invalid results list
            String projectItemName = validateSearchResult(index, username);
            if (projectItemName == null) {
                invalid.add(index);
                return;
            }

            Pair<String, Long> identifierPair = parseSearchIndexInfo(projectItemId);
            String type = identifierPair.getFirst();
            Long id = identifierPair.getSecond();
            // Check if map contains search result that has the same id.
            // If yes, reuse the same search result. Otherwise, create a new search result instance.
            SearchResultItem searchResultItem = results.getOrDefault(projectItemId, new SearchResultItem());
            searchResultItem.setType(ContentType.getType(type));
            searchResultItem.setId(id);
            searchResultItem.setName(projectItemName);
            if ((ContentType.getType(type).equals(ContentType.NOTE) && shareNotes.contains(id)) ||
                    (ContentType.getType(type).equals(ContentType.TASK) && shareTasks.contains(id))) {
                searchResultItem.setShared(true);
            }

            // Iterate through highlights and add them to Search Result Highlights
            Map<String, List<String>> highlights = searchHit.getHighlightFields();

            if (isContent) {
                // If matched search result is content, set content highlights
                highlights.keySet().forEach(k -> searchResultItem.addOrDefaultContentHighlights(highlights.get(k)));
            } else {
                highlights.keySet().forEach(k -> searchResultItem.addOrDefaultNameHighlights(highlights.get(k)));
            }

            results.put(projectItemId, searchResultItem);
        });
        return new ArrayList<>(results.values());
    }

    /**
     * Validate search result still exists.
     * <p>
     * 1. Determine the search index type.
     * - If type is NAME, search id in project item repo
     * - If type is CONTENT, search content in project content repo and search its parent in project item repo
     * 2. Return project item name, if result is valid. Otherwise, return null.
     *
     * @param searchIndex the target search index
     * @param username    the requester username
     * @return the project item name of the search index
     */
    private String validateSearchResult(SearchIndex searchIndex, String username) {
        Pair<String, Long> searchIndexPair = parseSearchIndexInfo(searchIndex.getId());
        String searchIndexType = searchIndexPair.getFirst();
        Long searchIndexId = searchIndexPair.getSecond();

        // If content type contains suffix as CONTENT
        boolean isContent = searchIndexType.endsWith(CONTENT_TYPE_SUFFIX);

        ProjectItemDaoJpa projectItemDaoJpa = getProjectItemDao(searchIndexType);

        try {
            if (isContent) {
                if (projectItemDaoJpa.getContent(searchIndexId, username) == null)
                    return null;

                searchIndexId = parseSearchIndexInfo(searchIndex.getParentId()).getSecond();
            }

            // If ResourceNotFound or NullPointer exception is thrown, return null
            return projectItemDaoJpa.getProjectItem(searchIndexId, username).getName();
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * Get ProjectItemDaoJpa based on input type.
     * Both ProjectItem and ProjectItem content return the same DaoJpa.
     *
     * @param type the requested dao type
     * @return the ProjectItemDao instance
     */
    private ProjectItemDaoJpa getProjectItemDao(String type) {
        switch (type) {
            case "task":
            case "task_content":
                return taskDaoJpa;
            case "transaction":
            case "transaction_content":
                return transactionDaoJpa;
            case "note":
            case "note_content":
                return noteDaoJpa;
            default:
                LOGGER.error("QueryController failed to get Project Item Dao");
                throw new IllegalArgumentException("Cannot recognize input type");
        }
    }
}
