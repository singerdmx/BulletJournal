package com.bulletjournal.repository;

import com.bulletjournal.repository.factory.Etaggable;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserProjectsDaoJpa implements Etaggable {

    private static final Gson GSON = new Gson();

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    /**
     * Todo
     */
    @Override
    public List<String> findAffectedUsernames(String contentId) {
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
