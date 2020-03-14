package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.ProjectItems;
import com.bulletjournal.controller.models.UpdateLabelParams;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class LabelDaoJpa {

    @Autowired
    private LabelRepository labelRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private AuthorizationService authorizationService;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Label create(String name, String owner, String icon) {
        Label label = new Label();
        label.setName(name);
        label.setOwner(owner);
        label.setIcon(icon);

        if (!this.labelRepository.findByNameAndOwner(name, owner).isEmpty()) {
            throw new ResourceAlreadyExistException("Label with name " + name + " already exists");
        }

        label = this.labelRepository.save(label);
        return label;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Label partialUpdate(String requester, Long labelId, UpdateLabelParams updateLabelParams) {
        Label label = this.labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label" + labelId + "not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                label.getOwner(), requester, ContentType.LABEL, Operation.UPDATE, labelId);

        if (Objects.equals(label.getName(), updateLabelParams.getValue())) {
            return label;
        }

        if (!this.labelRepository.findByNameAndOwner(updateLabelParams.getValue(), requester).isEmpty()) {
            throw new ResourceAlreadyExistException("Label with name " + updateLabelParams.getValue()
                    + " already exists");
        }

        DaoHelper.updateIfPresent(updateLabelParams.hasValue(), updateLabelParams.getValue(),
                label::setName);

        DaoHelper.updateIfPresent(updateLabelParams.hasIcon(), updateLabelParams.getIcon(),
                label::setIcon);

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
        List<Label> labels = this.labelRepository.findByOwner(owner)
                .stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .collect(Collectors.toList());
        return labels;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void delete(String requester, Long labelId) {
        Label label = this.labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label" + labelId + "not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(label.getOwner(), requester,
                ContentType.LABEL, Operation.DELETE, labelId);

        this.labelRepository.delete(label);

        List<Task> tasks = this.taskRepository.findTasksByLabelId(labelId);

        tasks.stream().forEach(
                task -> task.setLabels(
                        Arrays.stream(task.getLabels()).filter(id
                                -> id != labelId).toArray(Long[]::new)));

        this.taskRepository.saveAll(tasks);

    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<ProjectItems> getItemsByLabels(String timezone, List<Long> labels, String requester) {
        List<Label> l = this.labelRepository.findAllById(labels);

        Map<ZonedDateTime, ProjectItems> projectItemsMap = new HashMap<>();
        List<Task> tasks = this.taskRepository.findTasksByLabelIds(labels);
        List<Transaction> transactions = this.transactionRepository.findTransactionsByLabelIds(labels);
        List<Note> notes = this.noteRepository.findNotesByLabelIds(labels);

        if (l.stream().filter(label -> !label.getOwner().equals(requester)).findAny().isPresent()) {
            tasks = filter(tasks, requester);
            transactions = filter(transactions, requester);
            notes = filter(notes, requester);
        }

        Map<ZonedDateTime, List<Task>> tasksMap = ProjectItemsGrouper.groupTasksByDate(tasks);
        projectItemsMap = ProjectItemsGrouper.mergeTasksMap(projectItemsMap, tasksMap);
        Map<ZonedDateTime, List<Transaction>> transactionsMap = ProjectItemsGrouper.groupTransactionsByDate(transactions);
        projectItemsMap = ProjectItemsGrouper.mergeTransactionsMap(projectItemsMap, transactionsMap);
        Map<ZonedDateTime, List<Note>> notesMap = ProjectItemsGrouper.groupNotesByDate(notes, timezone);
        projectItemsMap = ProjectItemsGrouper.mergeNotesMap(projectItemsMap, notesMap);
        return ProjectItemsGrouper.getSortedProjectItems(projectItemsMap);
    }

    private <T extends ProjectItemModel> List<T> filter(List<T> projectItems, String requester) {
        return projectItems.stream().filter(
                item -> item.getProject().getGroup().getUsers().stream().filter(
                        u -> requester.equals(u.getUser().getName())
                ).findAny().isPresent()
        ).collect(Collectors.toList());
    }
}
