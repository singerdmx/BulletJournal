package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.ProjectItem;
import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.UpdateLabelParams;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.common.collect.ImmutableList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class LabelDaoJpa {

    private static final Map<String, String> DEFAULT_LABELS = new HashMap<String, String>() {
        {
            put("Utility", "BankOutlined");
            put("Grocery", "ShopOutlined");
            put("Restaurant", "HomeOutlined");
            put("Travel", "CarOutlined");
            put("Entertainment", "CustomerServiceOutlined");
            put("Favorite", "HeartOutlined");
            put("Star", "StarOutlined");
        }
    };

    @Autowired
    private LabelRepository labelRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private SharedProjectItemRepository sharedProjectItemRepository;

    @Autowired
    private AuthorizationService authorizationService;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void createDefaultLabels(String owner) {
        List<Label> defaultLabels = DEFAULT_LABELS.entrySet().stream().map(l -> {
            Label label = new Label();
            label.setName(l.getKey());
            label.setIcon(l.getValue());
            label.setOwner(owner);
            return label;
        }).collect(Collectors.toList());
        this.labelRepository.saveAll(defaultLabels);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Label create(String name, String owner, String icon) {
        Label label = new Label();
        label.setName(name);
        label.setOwner(owner);
        label.setIcon(icon);

        if (!this.labelRepository.findByNameAndOwner(name, owner).isEmpty()) {
            throw new ResourceAlreadyExistException("Label with name \"" + name + "\" already exists");
        }

        label = this.labelRepository.save(label);
        return label;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Label partialUpdate(String requester, Long labelId, UpdateLabelParams updateLabelParams) {
        Label label = this.labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label" + labelId + "not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(label.getOwner(), requester, ContentType.LABEL,
                Operation.UPDATE, labelId);

        if (Objects.equals(label.getName(), updateLabelParams.getValue())) {
            return label;
        }

        if (!this.labelRepository.findByNameAndOwner(updateLabelParams.getValue(), requester).isEmpty()) {
            throw new ResourceAlreadyExistException(
                    "Label with name \"" + updateLabelParams.getValue() + "\" already exists");
        }

        DaoHelper.updateIfPresent(updateLabelParams.hasValue(), updateLabelParams.getValue(), label::setName);

        DaoHelper.updateIfPresent(updateLabelParams.hasIcon(), updateLabelParams.getIcon(), label::setIcon);

        return this.labelRepository.save(label);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Label getLabel(Long id) {
        Label label = this.labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label" + id + "not found"));
        return label;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Label> getLabels(String owner) {
        List<Label> labels = this.labelRepository.findByOwner(owner).stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt())).collect(Collectors.toList());
        return labels;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void delete(String requester, Long labelId) {
        Label label = this.labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label" + labelId + "not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(label.getOwner(), requester, ContentType.LABEL,
                Operation.DELETE, labelId);

        this.labelRepository.delete(label);

        List<Task> tasks = this.taskRepository.findTasksByLabelId(labelId);
        tasks.stream().forEach(task -> task
                .setLabels(task.getLabels().stream().filter(id -> !Objects.equals(id, labelId))
                        .collect(Collectors.toList())));
        this.taskRepository.saveAll(tasks);

        List<Transaction> transactions = this.transactionRepository.findTransactionsByLabelId(labelId);
        transactions.stream().forEach(transaction -> transaction
                .setLabels(transaction.getLabels().stream().filter(id -> !Objects.equals(id, labelId))
                        .collect(Collectors.toList())));
        this.transactionRepository.saveAll(transactions);

        List<Note> notes = this.noteRepository.findNotesByLabelId(labelId);
        notes.stream().forEach(note -> note
                .setLabels(note.getLabels().stream().filter(id -> !Objects.equals(id, labelId))
                        .collect(Collectors.toList())));
        this.noteRepository.saveAll(notes);

        List<SharedProjectItem> sharedProjectItems = this.sharedProjectItemRepository
                .findSharedProjectItemsByLabelIds(requester, ImmutableList.of(labelId));
        sharedProjectItems.forEach(item -> item.setLabels(item.getLabels()
                .stream().filter(id -> !Objects.equals(id, labelId)).collect(Collectors.toList())));
        this.sharedProjectItemRepository.saveAll(sharedProjectItems);
    }

    /**
     * Retrieves project items by a list of labels
     * <p>
     * Steps: 1. Fetch project items with custom query of labels 2. Group project
     * items by date 3. Sort project items groups by date 4. Attach project items'
     * labels to themselves 5. Convert to presentation model and return
     *
     * @param timezone  the timezone of requester
     * @param labels    a list of labels
     * @param requester request user
     * @return List<ProjectItems> - a list of sorted project items with labels
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<ProjectItems> getItemsByLabels(String timezone, List<Long> labels, String requester) {
        Map<ZonedDateTime, ProjectItems> projectItemsMap = new HashMap<>();

        // Query project items from its own repository
        List<Task> tasks = this.taskRepository.findTasksByLabelIds(labels);
        List<Transaction> transactions = this.transactionRepository.findTransactionsByLabelIds(labels);
        List<Note> notes = this.noteRepository.findNotesByLabelIds(labels);

        Map<Long, Boolean> cache = new HashMap<>();
        tasks = filter(tasks, requester, cache);
        transactions = filter(transactions, requester, cache);
        notes = filter(notes, requester, cache);

        List<ProjectItemModel> sharedProjectItems = SharedProjectItemDaoJpa.getProjectItemModelsFromSharedItems(
                null, this.sharedProjectItemRepository.findSharedProjectItemsByLabelIds(requester, labels));
        for (ProjectItemModel projectItemModel : sharedProjectItems) {
            if (projectItemModel instanceof Task &&
                    tasks.stream().noneMatch(t -> Objects.equals(t.getId(), projectItemModel.getId()))) {
                tasks.add((Task) projectItemModel);
            }
            if (projectItemModel instanceof Note &&
                    notes.stream().noneMatch(n -> Objects.equals(n.getId(), projectItemModel.getId()))) {
                notes.add((Note) projectItemModel);
            }
        }

        // Group project items by date
        Map<ZonedDateTime, List<Task>> tasksMap = ProjectItemsGrouper.groupTasksByDate(tasks, true, timezone);
        projectItemsMap = ProjectItemsGrouper.mergeTasksMap(projectItemsMap, tasksMap);
        Map<ZonedDateTime, List<Transaction>> transactionsMap = ProjectItemsGrouper
                .groupTransactionsByDate(transactions, timezone);
        projectItemsMap = ProjectItemsGrouper.mergeTransactionsMap(projectItemsMap, transactionsMap);
        Map<ZonedDateTime, List<Note>> notesMap = ProjectItemsGrouper.groupNotesByDate(notes, timezone);
        projectItemsMap = ProjectItemsGrouper.mergeNotesMap(projectItemsMap, notesMap);
        List<ProjectItems> projectItems = ProjectItemsGrouper.getSortedProjectItems(projectItemsMap);
        return getLabelsForProjectItems(projectItems);
    }

    private <T extends ProjectItemModel> List<T> filter(List<T> projectItems, String requester,
            Map<Long, Boolean> cache) {
        return projectItems.stream().filter(item -> {
            Long projectId = item.getProject().getId();
            return cache.computeIfAbsent(projectId, k -> item.getProject().getGroup().getAcceptedUsers().stream()
                    .anyMatch(u -> requester.equals(u.getUser().getName())));
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<ProjectItems> getLabelsForProjectItems(List<ProjectItems> projectItems) {
        List<ProjectItem> items = new ArrayList<>();
        projectItems.forEach(item -> {
            item.getTasks().forEach(t -> items.add(t));
            item.getTransactions().forEach(t -> items.add(t));
            item.getNotes().forEach(n -> items.add(n));
        });
        getLabelsForProjectItemList(items);
        return projectItems;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItem> List<T> getLabelsForProjectItemList(List<T> projectItems) {
        if (projectItems == null || projectItems.isEmpty()) {
            return projectItems;
        }

        Set<Long> labelIds = new HashSet<>();
        projectItems.forEach(
                item -> labelIds.addAll(item.getLabels().stream().map(l -> l.getId()).collect(Collectors.toList())));

        Map<Long, com.bulletjournal.controller.models.Label> m = getLabels(new ArrayList<>(labelIds)).stream()
                .collect(Collectors.toMap(com.bulletjournal.controller.models.Label::getId, l -> l));

        projectItems.forEach(item -> item
                .setLabels(item.getLabels().stream()
                        .filter(l -> m.get(l.getId()) != null)
                        .map(l -> m.get(l.getId()))
                        .collect(Collectors.toList())));
        return projectItems;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Label> getLabels(final List<Long> labels) {
        if (labels == null || labels.isEmpty()) {
            return Collections.emptyList();
        }
        List<com.bulletjournal.controller.models.Label> labelsForPresentation =
                this.labelRepository.findAllById(labels).stream()
                        .filter(Objects::nonNull)
                        .sorted(Comparator.comparingInt(label -> labels.indexOf(label.getId())))
                        .map(Label::toPresentationModel).collect(Collectors.toList());
        return labelsForPresentation;
    }
}
