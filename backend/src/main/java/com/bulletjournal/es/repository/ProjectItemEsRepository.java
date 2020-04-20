package com.bulletjournal.es.repository;

import com.bulletjournal.controller.models.ProjectItem;
import org.elasticsearch.index.query.QueryBuilder;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectItemEsRepository extends ElasticsearchRepository<ProjectItem, String> {

    List<ProjectItem> findByName(String name);

    Iterable<ProjectItem> search(QueryBuilder queryBuilder);
}
