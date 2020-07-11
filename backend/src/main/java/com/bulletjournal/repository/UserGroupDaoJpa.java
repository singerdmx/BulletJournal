package com.bulletjournal.repository;

import com.bulletjournal.repository.factory.Etaggable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.Set;

@Repository
public class UserGroupDaoJpa implements Etaggable {

    @Autowired
    private UserGroupRepository userGroupRepository;
    /**
     * Get project ids from ProjectDaoJpa with HierarchyProcessor's findAllIds API.
     * Pass project id set to ProjectDaoJpa again to retrieve affected usernames.
     *
     * @param contentIds a set of content ids of user projects
     * @return a set of usernames
     */
    @Deprecated
    @Override
    public Set<String> findAffectedUsernames(Set<String> contentIds) {
        Set<String> usernames = new HashSet<>();

        // Todo: Needs to convert from String to UserGroupKey
        //userGroupRepository.findAllById(contentIds);

        return usernames;
    }

    @Deprecated
    @Override
    public String getUserEtag(String username) {
        return null;
    }
}
