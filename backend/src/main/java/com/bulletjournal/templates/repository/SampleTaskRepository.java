package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.SampleTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SampleTaskRepository extends JpaRepository<SampleTask, Long> {
    SampleTask getById(Long id);

    @Query("SELECT sampleTask FROM SampleTask sampleTask WHERE sampleTask.metadata LIKE %:metadataFilter%")
    List<SampleTask> getByMetadataFilter(@Param("metadataFilter") String filter);
}
