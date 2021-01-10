package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.ProjectSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectSettingRepository extends JpaRepository<ProjectSetting, Long> {

    List<ProjectSetting> findByProjectIn(List<Project> projects);
}