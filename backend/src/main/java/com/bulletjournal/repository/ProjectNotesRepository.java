package com.bulletjournal.repository;

import com.bulletjournal.repository.models.ProjectNotes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectNotesRepository extends JpaRepository<ProjectNotes, Long> {
}