package com.bulletjournal.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
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
    public User create(String name) {
        List<User> userList = this.userRepository.findByName(name);
        if (!userList.isEmpty()) {
            throw new ResourceAlreadyExistException("User " + name + " already exists");
        }

        User user = new User();
        user.setName(name);
        user = this.userRepository.save(user);

        Group group = new Group();
        group.setName(Group.DEFAULT_NAME);
        group.setOwner(name);
        group = this.groupRepository.save(group);

        user.addGroup(group);
        this.userGroupRepository.save(new UserGroup(user, group, true));
        return this.userRepository.save(user);
    }
}
