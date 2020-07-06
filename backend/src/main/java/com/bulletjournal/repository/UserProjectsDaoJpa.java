package com.bulletjournal.repository;

import com.bulletjournal.repository.factory.Etaggable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Repository
public class UserProjectsDaoJpa implements Etaggable {

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    /**
     * Todo
     */
    @Override
    public List<String> findAffectedUsernames(Set<String> contentIds) {
        List<String> users = new ArrayList<>();
        return users;
    }

    /**
     * Todo
     */
    @Override
    public String getUserEtag(String username) {
        return null;
    }
}
