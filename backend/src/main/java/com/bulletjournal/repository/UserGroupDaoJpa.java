package com.bulletjournal.repository;

import com.bulletjournal.repository.factory.Etaggable;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public class UserGroupDaoJpa implements Etaggable {

    @Autowired
    private UserGroupRepository userGroupRepository;

    /**
     * @param contentIds are usernames
     * @return a set of usernames
     */
    @Deprecated
    @Override
    public Set<String> findAffectedUsernames(Set<String> contentIds) {
        // contentIds are usernames
        return contentIds;
    }

    @Deprecated
    @Override
    public String getUserEtag(String username) {
        throw new NotImplementedException("UserGroupDaoJpa does not implement getUserEtag");
    }
}
