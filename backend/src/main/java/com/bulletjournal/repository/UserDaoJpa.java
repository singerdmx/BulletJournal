package com.bulletjournal.repository;

import com.bulletjournal.controller.models.UpdateMyselfParams;
import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class UserDaoJpa {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public User create(String name, String timezone) {
        List<User> userList = this.userRepository.findByName(name);
        if (!userList.isEmpty()) {
            throw new ResourceAlreadyExistException("User " + name + " already exists");
        }

        User user = new User();
        user.setName(name);
        user.setTimezone(timezone);
        user.setDateFormat(0);
        user.setTimeFormat(0);
        user.setCurrency("US");
        user = this.userRepository.save(user);

        Group group = new Group();
        group.setName(Group.DEFAULT_NAME);
        group.setOwner(name);
        group.setDefaultGroup(true);
        group = this.groupRepository.save(group);

        user.addGroup(group);
        this.userGroupRepository.save(new UserGroup(user, group, true));
        return this.userRepository.save(user);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public User getByName(String name) {
        List<User> userList = this.userRepository.findByName(name);
        if (userList.isEmpty()) {
            throw new ResourceNotFoundException("User " + name + " does not exist");
        }

        if (userList.size() > 1) {
            throw new IllegalStateException("More than one user " + name + " exist");
        }

        return userList.get(0);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public User updateMyself(String user, UpdateMyselfParams updateMyselfParams) {
        User self = getByName(user);
        DaoHelper.updateIfPresent(updateMyselfParams.hasTimezone(), updateMyselfParams.getTimezone(),
                (value) -> self.setTimezone(value));
        DaoHelper.updateIfPresent(updateMyselfParams.hasReminderBeforeTask(),
                updateMyselfParams.getReminderBeforeTask(),
                (value) -> self.setReminderBeforeTask(value));
        DaoHelper.updateIfPresent(updateMyselfParams.hasCurrency(),
                updateMyselfParams.getCurrency(),
                (value) -> self.setCurrency(value));
        return self;
    }
}
