package com.bulletjournal.clients;

import com.bulletjournal.controller.models.User;
import com.bulletjournal.repository.UserAliasDaoJpa;

public class MockUserAliasDaoJpa extends UserAliasDaoJpa {

    @Override
    public User updateUserAlias(User user) {
        return user;
    }
}
