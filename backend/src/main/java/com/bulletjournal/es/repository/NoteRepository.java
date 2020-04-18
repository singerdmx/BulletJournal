package com.bulletjournal.es.repository;

import com.bulletjournal.repository.models.Note;
import org.elasticsearch.index.query.QueryBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.Optional;

public class NoteRepository implements ElasticsearchRepository<Note, String> {
    @Override
    public <S extends Note> S index(S entity) {
        return null;
    }

    @Override
    public <S extends Note> S indexWithoutRefresh(S entity) {
        return null;
    }

    @Override
    public Iterable<Note> search(QueryBuilder query) {
        return null;
    }

    @Override
    public Page<Note> search(QueryBuilder query, Pageable pageable) {
        return null;
    }

    @Override
    public Page<Note> search(SearchQuery searchQuery) {
        return null;
    }

    @Override
    public Page<Note> searchSimilar(Note entity, String[] fields, Pageable pageable) {
        return null;
    }

    @Override
    public void refresh() {

    }

    @Override
    public Class<Note> getEntityClass() {
        return null;
    }

    @Override
    public Iterable<Note> findAll(Sort sort) {
        return null;
    }

    @Override
    public Page<Note> findAll(Pageable pageable) {
        return null;
    }

    @Override
    public <S extends Note> S save(S entity) {
        return null;
    }

    @Override
    public <S extends Note> Iterable<S> saveAll(Iterable<S> entities) {
        return null;
    }

    @Override
    public Optional<Note> findById(String s) {
        return Optional.empty();
    }

    @Override
    public boolean existsById(String s) {
        return false;
    }

    @Override
    public Iterable<Note> findAll() {
        return null;
    }

    @Override
    public Iterable<Note> findAllById(Iterable<String> strings) {
        return null;
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public void deleteById(String s) {

    }

    @Override
    public void delete(Note entity) {

    }

    @Override
    public void deleteAll(Iterable<? extends Note> entities) {

    }

    @Override
    public void deleteAll() {

    }
}
