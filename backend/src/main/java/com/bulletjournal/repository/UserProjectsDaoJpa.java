package com.bulletjournal.repository;

import com.bulletjournal.controller.models.Projects;
import com.bulletjournal.repository.factory.Etaggable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Repository
public class UserProjectsDaoJpa implements Etaggable {

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    // Todo: needs to optimize
    @Override
    public Set<String> findAffectedUsernames(Set<String> contentIds) {
        Set<String> users = new HashSet<>();
        List<Projects> projectsList = this.projectDaoJpa.getProjectsByOwners(contentIds);
        projectsList.forEach(p -> {
            p.getOwned().forEach(project ->
                    project.getGroup().getUsers().forEach(userGroup -> users.add(userGroup.getName())));
            p.getShared().forEach(projectsWithOwner -> users.add(projectsWithOwner.getOwner().getName()));
        });
        return users;
    }


    @Override
    public String getUserEtag(String username) {
        return this.projectDaoJpa.getUserEtag(username);
    }
}
