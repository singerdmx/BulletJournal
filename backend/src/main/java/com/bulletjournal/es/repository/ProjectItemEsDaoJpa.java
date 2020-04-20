package com.bulletjournal.es.repository;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.ProjectItem;
import com.bulletjournal.repository.UserGroupRepository;
import com.bulletjournal.repository.UserRepository;
import com.bulletjournal.repository.models.Group;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.repository.models.UserGroup;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ProjectItemEsDaoJpa {

    @Autowired
    ProjectItemEsRepository projectItemEsRepository;
    @Autowired
    UserGroupRepository userGroupRepository;
    @Autowired
    private UserRepository userRepository;

    public List<ProjectItem> getName(String name) {
        return projectItemEsRepository.findByName(name);
    }

    public Long create(ProjectItem projectItem) {
        projectItemEsRepository.save(projectItem);
        return projectItem.getId();
    }

    public List<ProjectItem> search(String term) {
        List<ProjectItem> results = new ArrayList<>();

        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<User> userList = this.userRepository.findByName(username);
        List<Long> userIdList = userList.stream().map(User::getId).collect(Collectors.toList());
        List<Long> groupIdList = userGroupRepository.findAllByUserId(userIdList.get(0))
                .stream().map(UserGroup::getGroup).map(Group::getId).collect(Collectors.toList());

        QueryBuilder queryBuilder = QueryBuilders.boolQuery()
                .filter(QueryBuilders.termsQuery("group_id", groupIdList))
                .must(QueryBuilders.matchQuery("project_item_name", term)
                        .fuzziness(Fuzziness.AUTO)
                        .prefixLength(3)
                        .maxExpansions(10));

        for (ProjectItem projectItem : projectItemEsRepository.search(queryBuilder)) {
            results.add(projectItem);
        }
        return results;
    }
}
