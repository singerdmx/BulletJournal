package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {
    List<Label> findByOwner(String owner);

    List<Label> findByNameAndOwner(String name, String owner);
}
