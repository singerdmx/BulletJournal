package com.bulletjournal.repository.utils;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.UserRepository;
import com.bulletjournal.repository.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ValidationUtil {

    @Autowired
    UserRepository userRepository;

    public void validateUser(String username) {
        List<User> users = this.userRepository.findByName(username);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("User " + username + " does not exist");
        }

        if (users.size() > 1) {
            throw new IllegalStateException("More than one user " + username + " exist");
        }
    }
}
