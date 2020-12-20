package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.config.ContentRevisionConfig;
import com.bulletjournal.contents.ContentAction;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.notifications.*;
import com.bulletjournal.redis.RedisCachedContentRepository;
import com.bulletjournal.redis.models.CachedContent;
import com.bulletjournal.repository.models.ContentModel;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.util.ContentDiffTool;
import com.bulletjournal.util.DeltaContent;
import com.bulletjournal.util.DeltaConverter;
import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

public abstract class ProjectItemDaoJpa<K extends ContentModel> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectItemDaoJpa.class);
    private static final Gson GSON = new Gson();

    private static final int CONTENT_BATCH_SIZE = 18;

    @Autowired
    protected LabelDaoJpa labelDaoJpa;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private GroupDaoJpa groupDaoJpa;
    @Autowired
    private SharedProjectItemDaoJpa sharedProjectItemDaoJpa;
    @Autowired
    private PublicProjectItemDaoJpa publicProjectItemDaoJpa;
    @Autowired
    private ContentRevisionConfig revisionConfig;
    @Autowired
    private ContentDiffTool contentDiffTool;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    protected NotificationService notificationService;
    @Autowired
    private RedisCachedContentRepository redisCachedContentRepository;
    @Autowired
    private EntityManager entityManager;

    abstract <T extends ProjectItemModel> JpaRepository<T, Long> getJpaRepository();

    abstract JpaRepository<K, Long> getContentJpaRepository();

    abstract <T extends ProjectItemModel> List<K> findContents(T projectItem);

    abstract K newContent(String text);

    abstract List<Long> findItemLabelsByProject(com.bulletjournal.repository.models.Project project);

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> SharableLink generatePublicItemLink(Long projectItemId, String requester,
                                                                            Long ttl) {
        T projectItem = getProjectItem(projectItemId, requester);
        SharableLink sharableLink = this.publicProjectItemDaoJpa.generatePublicItemLink(projectItem, requester, ttl);
        this.notificationService.trackActivity(
                new Auditable(projectItem.getProject().getId(),
                        "shared " + projectItem.getContentType() +
                                " ##" + projectItem.getName() + "## in BuJo ##" + projectItem.getProject().getName() +
                                "## with link ##" + sharableLink.getLink() + "##",
                        requester, projectItemId, Timestamp.from(Instant.now()), ContentAction.SHARE));
        return sharableLink;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> ShareProjectItemEvent shareProjectItem(Long projectItemId,
                                                                               ShareProjectItemParams shareProjectItemParams, String requester) {
        T projectItem = getProjectItem(projectItemId, requester);
        List<String> users = new ArrayList<>();
        if (StringUtils.isNotBlank(shareProjectItemParams.getTargetUser())) {
            users.add(shareProjectItemParams.getTargetUser());
        }

        if (shareProjectItemParams.getTargetGroup() != null) {
            Group group = this.groupDaoJpa.getGroup(shareProjectItemParams.getTargetGroup());
            for (UserGroup userGroup : group.getAcceptedUsers()) {
                users.add(userGroup.getUser().getName());
            }
        }

        ProjectType projectType = ProjectType.getType(projectItem.getProject().getType());
        ShareProjectItemEvent event = this.sharedProjectItemDaoJpa.save(projectType, projectItem, users, requester);
        this.notificationService.trackActivity(new Auditable(
                projectItem.getProject().getId(),
                "shared " + projectItem.getContentType() +
                        " ##" + projectItem.getName() + "## in BuJo ##" + projectItem.getProject().getName() +
                        "## with " +
                        (users.size() == 1 ? "user ##" + users.get(0) :
                                "users ##" + users.toString().substring(1, users.toString().length() - 1))
                        + "##",
                requester, projectItemId, Timestamp.from(Instant.now()), ContentAction.SHARE));
        return event;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> ProjectItemSharables getSharables(Long projectItemId, String requester) {
        T projectItem = getProjectItem(projectItemId, requester);

        List<SharableLink> links = this.publicProjectItemDaoJpa.getPublicItemLinks(projectItem).stream()
                .map(item -> item.toSharableLink()).collect(Collectors.toList());
        Set<String> users = this.sharedProjectItemDaoJpa.getProjectItemSharedUsers(projectItem).stream()
                .map(item -> item.getUsername()).collect(Collectors.toSet());
        ProjectItemSharables result = new ProjectItemSharables();
        result.setLinks(links);
        result.setUsers(users.stream().map(u -> new User(u)).collect(Collectors.toList()));
        return result;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> RevokeSharableEvent revokeSharable(Long projectItemId, String requester,
                                                                           RevokeProjectItemSharableParams revokeProjectItemSharableParams) {
        T projectItem = getProjectItem(projectItemId, requester);

        String link = revokeProjectItemSharableParams.getLink();
        if (link != null) {
            this.publicProjectItemDaoJpa.revokeSharableLink(projectItem, link);
        }

        String user = revokeProjectItemSharableParams.getUser();
        if (user != null) {
            this.sharedProjectItemDaoJpa.deleteSharedProjectItemWithUser(projectItem, user);
            return new RevokeSharableEvent(new Event(user, projectItemId, projectItem.getName()), requester,
                    projectItem.getContentType());
        }

        return null;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void removeShared(Long projectItemId, String requester) {
        T projectItem = getProjectItem(projectItemId, requester);
        this.sharedProjectItemDaoJpa.deleteSharedProjectItemWithUser(projectItem, requester);
    }

    public <T extends ProjectItemModel> void addContent(List<T> projectItems, List<String> owners, List<K> contents) {
        LOGGER.info("Adding {} contents", contents.size());
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            LOGGER.error("addContent Interrupted", e);
        }
        List<K> batch = new ArrayList<>();
        int maxSize = Math.min(contents.size(), CONTENT_BATCH_SIZE);
        for (int i = 0; i < maxSize; i++) {
            K content = contents.get(i);
            if (StringUtils.isBlank(content.getText())) {
                continue;
            }
            String owner = owners.get(i);
            T projectItem = projectItems.get(i);
            content.setProjectItem(projectItem);
            content.setOwner(owner);
            content.setText(DeltaConverter.supplementContentText(content.getText(), false));
            batch.add(content);
        }
        if (!batch.isEmpty()) {
            this.getContentJpaRepository().saveAll(batch);
        }

        if (contents.size() <= CONTENT_BATCH_SIZE) {
            return;
        }

        ContentBatch<K, T> left = new ContentBatch<>(
                contents.subList(CONTENT_BATCH_SIZE, contents.size()),
                projectItems.subList(CONTENT_BATCH_SIZE, projectItems.size()),
                owners.subList(CONTENT_BATCH_SIZE, owners.size()));
        LOGGER.info("Next ContentBatch: {} contents", left.getContents().size());
        this.notificationService.addContentBatch(left);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> Pair<ContentModel, T> addContent(Long projectItemId, String owner, K content) {
        T projectItem = getProjectItem(projectItemId, owner);
        populateContent(owner, content, projectItem);
        this.getContentJpaRepository().save(content);
        return Pair.of(content, projectItem);
    }

    private <T extends ProjectItemModel> void populateContent(String owner, K content, T projectItem) {
        content.setProjectItem(projectItem);
        content.setOwner(owner);
        content.setText(DeltaConverter.supplementContentText(content.getText()));
        updateRevision(content, owner, content.getText(), content.getText());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> Pair<ContentModel, T> addContentForUncompleted(Long projectItemId, String owner, K content) {
        T projectItem = getProjectItem(projectItemId, owner);
        content.setProjectItem(projectItem);
        content.setOwner(owner);
        updateRevision(content, owner, content.getText(), content.getText());
        this.getContentJpaRepository().save(content);
        return Pair.of(content, projectItem);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public K getContent(Long contentId, String requester) {
        K content = this.getContentJpaRepository().findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content " + contentId + " not found"));
        this.authorizationService.validateRequesterInProjectGroup(requester, content.getProjectItem());
        return content;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public K patchRevisionContentHistory(Long contentId, Long projectItemId,
                                         String requester, List<String> revisionContents,
                                         String etag) {
        LOGGER.info(GSON.toJson(revisionContents));

        getProjectItem(projectItemId, requester); // permission check
        int n = revisionContents.size();
        String lastRevisionContent = revisionContents.get(n - 1);
        K content;
        synchronized (this) {
            content = getContent(contentId, requester);
            if (redisCachedContentRepository.existsById(contentId)) {
                return content;
            }
            // read etag from DB content text column
            String noteEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE, content.getText());
            LOGGER.info("web etag =" + etag + " and db etag =" + noteEtag);
            if (!Objects.equals(etag, noteEtag)) {
                throw new BadRequestException("Invalid etag");
            }
            content.setText(DeltaConverter.mergeContentText(lastRevisionContent, content.getText()) );
            content = this.getContentJpaRepository().saveAndFlush(content);
            redisCachedContentRepository.save(new CachedContent(contentId));
        }

        // iterate pairs
        for (int i = 0; i < n - 1; ++i) {
            String first = revisionContents.get(i);
            String second = revisionContents.get(i + 1);
            LOGGER.info("first=" + first + "\t second=" + second);
            updateRevision(content, requester, second, first);
        }
        content = this.getContentJpaRepository().saveAndFlush(content);
        LOGGER.info("patchRevisionContentHistory return {}", content);
        return content;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> Pair<K, T> updateContent(Long contentId, Long projectItemId, String requester,
                                                                 UpdateContentParams updateContentParams, Optional<String> etag) {
        T projectItem = getProjectItem(projectItemId, requester);
        K content = getContent(contentId, requester);
        Preconditions.checkState(Objects.equals(projectItem.getId(), content.getProjectItem().getId()),
                "ProjectItem ID mismatch");
        this.authorizationService.checkAuthorizedToOperateOnContent(content.getOwner(), requester, ContentType.CONTENT,
                Operation.UPDATE, content.getId(), projectItem.getOwner(), projectItem.getProject().getOwner(),
                projectItem);
        String mdiff = updateContentParams.getMdiff();
        String diff = updateContentParams.getDiff();
        if (mdiff != null && diff != null) {
            LOGGER.error("Cannot have both diff and mdiff");
            throw new BadRequestException("Cannot have both diff and mdiff");
        }

        String oldText = content.getText();

        if (etag.isPresent()) {
            String itemEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                    EtagGenerator.HashType.TO_HASHCODE, oldText);
            if (!Objects.equals(etag.get(), itemEtag)) {
                LOGGER.info("Invalid Etag: {} v.s. {}, oldText: {}; created a new content", itemEtag, etag.get(), oldText);
                return (Pair<K, T>) this.addContent(
                        projectItemId, requester, this.newContent(updateContentParams.getText()));
            }
        }

        if (diff != null) {
            // from web: {delta: YYYYY2, ###html###:ZZZZZZ2}, diff
            Map diffMap = GSON.fromJson(diff, LinkedHashMap.class);
            DeltaContent oldContent = new DeltaContent(oldText);

            // web delta and html
            DeltaContent newContent = new DeltaContent(updateContentParams.getText());

            // mobile mdelta
            newContent.setMdeltaList(oldContent.getMdeltaList());

            // mobile mdiff
            List<LinkedHashMap> newMdiff = DeltaConverter.diffToMdiff(diffMap);
            List<Object> oldMdiffList = oldContent.getMdiffOrDefault(new ArrayList<>());
            oldMdiffList.add(newMdiff);
            newContent.setMdiff(oldMdiffList);

            LOGGER.info("web -> mobile, the content = " + newContent.toJSON());
            content.setText(newContent.toJSON());
            // save to db: {delta: YYYYY2, ###html###:ZZZZZZ2, mdelta:XXXXXX, mdiff: [d1] }
        } else if (mdiff != null) {
            List mdiffList = GSON.fromJson(mdiff, List.class);
            // from mobile: {mdelta:XXXXXX }, mdiff
            // mdiff: [{"retain":5,"attributes":{"b":true}}],mdelta: [{"insert":"hello","attributes":{"b":true}},{"insert":"\n"}]
            DeltaContent oldContent = new DeltaContent(oldText);

            // mobile mdelta
            DeltaContent newContent = new DeltaContent(updateContentParams.getText());

            // web delta
            newContent.setDeltaMap(oldContent.getDeltaMap());

            // web diff
            List<Object> oldDiffList = oldContent.getDiffOrDefault(new ArrayList<>());
            Map newDiff = DeltaConverter.mdiffToDiff(mdiffList);
            oldDiffList.add(newDiff);
            newContent.setDiff(oldDiffList);

            LOGGER.info("mobile -> web, the content = " + newContent.toJSON());
            content.setText(newContent.toJSON());
            // save to db: {delta: YYYYY, mdelta:XXXXXX2, diff: [d2] }
        } else {
            LOGGER.error("Cannot have null in both diff and mdiff");
            throw new BadRequestException("Cannot have null in both diff and mdiff");
        }

        updateRevision(content, requester, content.getText(), oldText);
        this.getContentJpaRepository().save(content);
        return Pair.of(content, projectItem);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> T deleteContent(Long contentId, Long projectItemId, String requester) {
        T projectItem = getProjectItem(projectItemId, requester);
        K content = getContent(contentId, requester);
        Preconditions.checkState(Objects.equals(projectItem.getId(), content.getProjectItem().getId()),
                "ProjectItem ID mismatch");
        this.authorizationService.checkAuthorizedToOperateOnContent(content.getOwner(), requester, ContentType.CONTENT,
                Operation.DELETE, content.getId(), projectItem.getOwner(), projectItem.getProject().getOwner(),
                projectItem);
        this.getContentJpaRepository().delete(content);
        return projectItem;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> T getProjectItem(Long projectItemId, String requester) {
        ProjectItemModel projectItem = this.getJpaRepository().findById(projectItemId)
                .orElseThrow(() -> new ResourceNotFoundException("projectItem " + projectItemId + " not found"));
        this.authorizationService.validateRequesterInProjectGroup(requester, projectItem);
        return (T) projectItem;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    protected <T extends ProjectItemModel> List<com.bulletjournal.controller.models.Label> getLabelsToProjectItem(
            T projectItem) {
        return this.labelDaoJpa.getLabels(
                projectItem.isShared() ? projectItem.getSharedItemLabels() : projectItem.getLabels());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public SetLabelEvent setLabels(String requester, Long projectItemId, List<Long> labels) {
        ProjectItemModel<ProjectItem> projectItem = getProjectItem(projectItemId, requester);
        projectItem.setLabels(labels);
        Set<UserGroup> targetUsers = projectItem.getProject().getGroup().getAcceptedUsers();
        List<Event> events = new ArrayList<>();
        for (UserGroup user : targetUsers) {
            if (!Objects.equals(user.getUser().getName(), requester)) {
                events.add(new Event(user.getUser().getName(), projectItemId, projectItem.getName()));
            }
        }

        this.getJpaRepository().save(projectItem);
        return new SetLabelEvent(events, requester, projectItem.getContentType());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> Revision getContentRevision(String requester, Long projectItemId,
                                                                    Long contentId, Long revisionId) {
        T projectItem = getProjectItem(projectItemId, requester);
        K content = getContent(contentId, requester);
        Preconditions.checkState(Objects.equals(projectItem.getId(), content.getProjectItem().getId()),
                "ProjectItem ID mismatch");
        Revision[] revisions = GSON.fromJson(content.getRevisions(), Revision[].class);
        Preconditions.checkNotNull(revisions, "Revisions for Content: {} is null", contentId);
        if (!Arrays.stream(revisions).anyMatch(revision -> Objects.equals(revision.getId(), revisionId))) {
            throw new BadRequestException("Invalid revisionId: " + revisionId + " for content: " + contentId);
        }

        if (revisionId.equals(revisions[revisions.length - 1].getId())) {
            revisions[revisions.length - 1].setContent(content.getText());
            return revisions[revisions.length - 1];
        }

        String ret = content.getBaseText();
        for (Revision revision : revisions) {
            ret = contentDiffTool.applyDiff(ret, revision.getDiff());
            if (revision.getId().equals(revisionId)) {
                revision.setContent(ret);
                return revision;
            }
        }
        throw new IllegalStateException("Cannot reach here");
    }

    private void updateRevision(K content, String requester, String newText, String oldText) {
        if (!newText.contains(DeltaContent.HTML_TAG)) {
            LOGGER.info("{} does not contain {}", newText, DeltaContent.HTML_TAG);
            return;
        }
        String revisionsJson = content.getRevisions();
        if (revisionsJson == null) {
            revisionsJson = "[]";
        }
        LinkedList<Revision> revisionList = new LinkedList<>(
                Arrays.asList(GSON.fromJson(revisionsJson, Revision[].class)));
        int maxRevisionNumber = revisionConfig.getMaxRevisionNumber();
        long nextRevisionId;
        if (revisionList.isEmpty()) {
            content.setBaseText(oldText);
            nextRevisionId = 1;
        } else {
            nextRevisionId = revisionList.getLast().getId() + 1;
            if (revisionList.size() == maxRevisionNumber) {
                String oldBaseText = content.getBaseText();
                String diffToMerge = revisionList.pollFirst().getDiff();
                content.setBaseText(contentDiffTool.applyDiff(oldBaseText, diffToMerge));
            }
        }
        String diff = contentDiffTool.computeDiff(oldText, newText);
        Revision newRevision = new Revision(nextRevisionId, diff, Instant.now().toEpochMilli(), new User(requester));
        revisionList.offerLast(newRevision);
        content.setRevisions(GSON.toJson(revisionList));
    }

    /**
     * Get Contents for project
     *
     * @param projectItemId the project item id
     * @param requester     the username of action requester
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> List<K> getContents(Long projectItemId, String requester) {
        T projectItem = getProjectItem(projectItemId, requester);
        return this.findContents(projectItem).stream().sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    abstract <T extends ProjectItemModel> List<T> findRecentProjectItemsBetween(Timestamp startTime, Timestamp endTime, List projects);

    abstract List<Object[]> findRecentProjectItemContentsBetween(Timestamp startTime, Timestamp endTime, List projectIds);

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> List<T> getRecentProjectItemsBetween(Timestamp startTime, Timestamp endTime, List<Long> projectIds) {
        if (projectIds == null || projectIds.isEmpty()) {
            return Collections.emptyList();
        }
        Map<Long, T> projectItemIdMap = new HashMap<>();

        List<T> projectItemModels = this.findRecentProjectItemsBetween(startTime, endTime,
                projectRepository.findAllById(projectIds));
        projectItemModels.forEach(item -> projectItemIdMap.put(item.getId(), item));

        List<Object[]> projectItemJoinContentModels = this.findRecentProjectItemContentsBetween(startTime, endTime, projectIds);
        projectItemJoinContentModels.forEach(item -> {
            Long projectItemId = null;
            Timestamp mostRecentTime = null;
            for (Object o : item) {
                if (projectItemId == null) {
                    projectItemId = ((BigInteger) o).longValue();
                } else {
                    mostRecentTime = (Timestamp) o;
                }
            }
            if (!projectItemIdMap.containsKey(projectItemId)) {
                T projectItem = (T) this.getJpaRepository().findById(projectItemId).get();
                projectItem.setUpdatedAt(mostRecentTime);
                projectItemIdMap.put(projectItemId, projectItem);
            } else if (projectItemIdMap.get(projectItemId).getUpdatedAt().compareTo(mostRecentTime) == -1)
                projectItemIdMap.get(projectItemId).setUpdatedAt(mostRecentTime);
        });


        return new ArrayList<>(projectItemIdMap.values());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<ProjectItemModel> findAllById(Iterable<Long> ids,
                                              com.bulletjournal.repository.models.Project project) {
        List<ProjectItemModel> items = this.getJpaRepository().findAllById(ids);
        if (items.stream().anyMatch(item -> !Objects.equals(project.getId(), item.getProject().getId()))) {
            throw new UnAuthorizedException("Not in project");
        }
        return items;
    }
}

