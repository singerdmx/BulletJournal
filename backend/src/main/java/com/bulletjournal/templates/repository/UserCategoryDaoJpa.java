package com.bulletjournal.templates.repository;

import com.bulletjournal.repository.models.User;
import com.bulletjournal.templates.repository.model.UserCategory;
import com.bulletjournal.templates.repository.model.UserCategoryKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    public void updateUserCategory(User user, Long categoryId, List<Long> selections) {
        UserCategoryKey userCategoryKey = new UserCategoryKey();
        userCategoryKey.setCategoryId(categoryId);
        userCategoryKey.setUserId(user.getId());
        UserCategory userCategory;
        if (!checkExist(userCategoryKey)) {
            userCategory = new UserCategory();
            if (selections != null) {
                userCategory.setSelections(selections.stream().distinct().map(Object::toString).collect(Collectors.joining(",")));
            }
            userCategory.setCategory(this.categoryDaoJpa.getById(categoryId));
            userCategory.setUser(user);
            userCategory.setUserCategoryKey(userCategoryKey);
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
