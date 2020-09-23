package com.bulletjournal.templates.repository;

import com.bulletjournal.repository.models.User;
import com.bulletjournal.templates.controller.model.ImportTasksParams;
import com.bulletjournal.templates.repository.model.UserCategory;
import com.bulletjournal.templates.repository.model.UserCategoryKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class UserCategoryDaoJpa {
    @Autowired
    private UserCategoryRepository userCategoryRepository;

    @Autowired
    private CategoryDaoJpa categoryDaoJpa;


    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void save(UserCategory userCategory) {
        if (userCategory != null) {
            userCategoryRepository.save(userCategory);
        }
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
    public void updateUserCategory(User user, ImportTasksParams importTasksParams) {
        UserCategoryKey userCategoryKey = new UserCategoryKey();
        userCategoryKey.setCategoryId(importTasksParams.getCategoryId());
        userCategoryKey.setUserId(user.getId());
        UserCategory userCategory;
        if (!checkExist(userCategoryKey)) {
            userCategory = new UserCategory();
            if (importTasksParams.getSelections() != null) {
                userCategory.setSelections(importTasksParams.getSelections().stream().distinct().map(Object::toString).collect(Collectors.joining(",")));
            }
            userCategory.setCategory(this.categoryDaoJpa.getById(importTasksParams.getCategoryId()));
            userCategory.setUser(user);
            userCategory.setUserCategoryKey(userCategoryKey);
        } else {
            userCategory = getUserCategoryByKey(userCategoryKey);
            Set<String> selectionSet = userCategory.getSelectionIds().stream().map(Object::toString).collect(Collectors.toSet());
            if (importTasksParams.getSelections() != null) {
                selectionSet.addAll(importTasksParams.getSelections().stream().map(Object::toString).collect(Collectors.toList()));
            }
            userCategory.setSelections(selectionSet);
        }
        save(userCategory);
    }
}
