package com.bulletjournal.repository;

import com.bulletjournal.repository.factory.Etaggable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class UserProjectsDaoJpa implements Etaggable {

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    /**
     * Get project ids from ProjectDaoJpa with HierarchyProcessor's findAllIds API.
     * Pass project id set to ProjectDaoJpa again to retrieve affected usernames.
     *
     * @param contentIds a set of content ids of user projects
     * @return a set of usernames
     */
    @Override
    public Set<String> findAffectedUsernames(Set<String> contentIds) {
        Set<Long> projectIds = this.projectDaoJpa.getProjectIdsByOwners(contentIds);
        return this.projectDaoJpa.findAffectedUsernames(projectIds
                .stream()
                .map(String::valueOf)
                .collect(Collectors.toSet()));
    }


    @Override
    public String getUserEtag(String username) {
        return this.projectDaoJpa.getUserEtag(username);
    }
}
