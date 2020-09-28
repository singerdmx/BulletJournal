package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.ProjectRepository;
import com.bulletjournal.repository.UserDaoJpa;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.templates.repository.model.UserCategory;
import com.bulletjournal.templates.repository.model.UserCategoryKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class UserCategoryDaoJpa {
    private static Logger LOGGER = LoggerFactory.getLogger(UserCategoryDaoJpa.class);

    @Autowired
    private UserCategoryRepository userCategoryRepository;

    @Autowired
    private CategoryDaoJpa categoryDaoJpa;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SelectionMetadataKeywordRepository selectionMetadataKeywordRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void save(UserCategory userCategory) {
        if (userCategory != null) {
            userCategoryRepository.save(userCategory);
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<UserCategory> getUserCategoriesByUserName(String username) {
        User user = userDaoJpa.getByName(username);
        return userCategoryRepository.getAllByUser(user);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public UserCategory getUserCategoryByKey(UserCategoryKey userCategoryKey) {
        if (userCategoryKey == null) {
            return null;
        }
        return userCategoryRepository.getOne(userCategoryKey);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public boolean checkExist(UserCategoryKey userCategoryKey) {
        return userCategoryRepository.existsById(userCategoryKey);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUserCategory(User user, Long categoryId, List<Long> selections, Long projectId) {
        Project project = this.projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException(
                "Project " + projectId + " not found"));
        UserCategoryKey userCategoryKey = new UserCategoryKey(
                user.getId(), categoryId, "LEETCODE_ALGORITHM");
        UserCategory userCategory;
        if (!checkExist(userCategoryKey)) {
            userCategory = new UserCategory();
            if (selections != null) {
                userCategory.setSelections(selections.stream().distinct().map(Object::toString).collect(Collectors.joining(",")));
            }
            userCategory.setCategory(this.categoryDaoJpa.getById(categoryId));
            userCategory.setUser(user);
            userCategory.setUserCategoryKey(userCategoryKey);
            userCategory.setProject(project);
            userCategory.setMetadataKeyword(
                    selectionMetadataKeywordRepository.findById("LEETCODE_ALGORITHM")
                            .orElseThrow(() -> new ResourceNotFoundException("LEETCODE_ALGORITHM not found")));
        } else {
            userCategory = getUserCategoryByKey(userCategoryKey);
            Set<String> selectionSet = userCategory.getSelectionIds().stream().map(Object::toString).collect(Collectors.toSet());
            if (selections != null) {
                selectionSet.addAll(selections.stream().map(Object::toString).collect(Collectors.toList()));
            }
            userCategory.setSelections(selectionSet);
        }
        save(userCategory);
    }
}
