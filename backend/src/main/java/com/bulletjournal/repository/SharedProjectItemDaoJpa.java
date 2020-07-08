package com.bulletjournal.repository;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.ShareProjectItemEvent;
import com.bulletjournal.repository.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Repository
public class SharedProjectItemDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(SharedProjectItemDaoJpa.class);

    @Autowired
    private SharedProjectItemRepository sharedProjectItemsRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<ProjectItemModel> getSharedProjectItems(
            String requester, final ContentType contentType) {
        List<ProjectItemModel> result = new ArrayList<>();
        List<SharedProjectItem> items = this.sharedProjectItemsRepository.findByUsername(requester);
        items.forEach(item -> {
            ProjectItemModel projectItem;
            if (item.hasNote()) {
                projectItem = item.getNote();
            } else if (item.hasTask()) {
                projectItem = item.getTask();
            } else if (item.hasTransaction()) {
                projectItem = item.getTransaction();
            } else {
                throw new IllegalStateException();
            }

            if (contentType == null || contentType == projectItem.getContentType()) {
                result.add(projectItem);
            }
            projectItem.setLabels(Collections.emptyList()); // TODO: set correct labels
        });

        return result.stream()
                .sorted((a, b) -> Long.compare(b.getId(), a.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<ProjectItemModel> getSharedProjectItems(String user) {
        return getSharedProjectItems(user, null);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> ShareProjectItemEvent save(
            ProjectType projectType, T projectItem, List<String> users, String requester) {
        List<Event> events = new ArrayList<>();
        for (String user : new HashSet<>(users)) {
            if (Objects.equals(user, requester)) {
                continue;
            }
            List<ProjectItemModel> existingItems = this.getSharedProjectItems(user);
            if (existingItems.stream().anyMatch(existingItem ->
                    Objects.equals(existingItem.getContentType(), projectItem.getContentType()) &&
                            Objects.equals(existingItem.getId(), projectItem.getId()))) {
                LOGGER.error(projectItem.getClass().getSimpleName() + " " + projectItem.getName() +
                        " (ID " + projectItem.getId() +
                        ") is already shared with User " + user);
                continue;
            }

            User targetUser = this.userDaoJpa.getByName(user);
            SharedProjectItem sharedProjectItem = new SharedProjectItem(requester, user);
            switch (projectType) {
                case NOTE:
                    checkSharedProjectExistence(
                            targetUser.hasSharedNotesProject(),
                            projectType,
                            targetUser,
                            targetUser::setSharedNotesProject);
                    sharedProjectItem.setNote((Note) projectItem);
                    break;
                case TODO:
                    checkSharedProjectExistence(
                            targetUser.hasSharedTasksProject(),
                            projectType,
                            targetUser,
                            targetUser::setSharedTasksProject);
                    sharedProjectItem.setTask((Task) projectItem);
                    break;
                case LEDGER:
                    checkSharedProjectExistence(
                            targetUser.hasSharedTransactionsProject(),
                            projectType,
                            targetUser,
                            targetUser::setSharedTransactionsProject);
                    sharedProjectItem.setTransaction((Transaction) projectItem);
                    break;
                default:
                    throw new IllegalArgumentException();
            }
            this.sharedProjectItemsRepository.save(sharedProjectItem);
            Event event = new Event(user, projectItem.getId(), projectItem.getName());
            events.add(event);
        }
        return new ShareProjectItemEvent(events, requester, projectItem.getContentType());
    }

    private void checkSharedProjectExistence(
            boolean sharedProjectExists, ProjectType projectType, User user, Consumer<Project> userConsumer) {
        if (sharedProjectExists) {
            return;
        }

        Project project = new Project(
                "Shared " + projectType.name(),
                projectType.getValue(),
                this.groupDaoJpa.getDefaultGroup(user.getName()),
                true);
        project.setOwner(user.getName());
        this.projectRepository.save(project);

        userConsumer.accept(project);
        this.userRepository.save(user);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> List<SharedProjectItem> getProjectItemSharedUsers(T projectItem) {
        List<SharedProjectItem> sharedProjectItems;
        switch (projectItem.getContentType()) {
            case TASK:
                sharedProjectItems = this.sharedProjectItemsRepository.findByTask((Task) projectItem);
                break;
            case NOTE:
                sharedProjectItems = this.sharedProjectItemsRepository.findByNote((Note) projectItem);
                break;
            default:
                throw new IllegalArgumentException();
        }

        return sharedProjectItems;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void deleteSharedProjectItemWithUser(T projectItem, String user) {
        SharedProjectItem sharedProjectItem = this.getProjectItemSharedUsers(projectItem)
                .stream()
                .filter(item -> Objects.equals(item.getUsername(), user))
                .findAny().orElseThrow(() -> new ResourceNotFoundException("User " + user + " not found"));
        this.sharedProjectItemsRepository.delete(sharedProjectItem);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void setItemLabels(Long id, ContentType contentType, String requester) {
    }
}
