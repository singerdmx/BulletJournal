package com.bulletjournal.repository;

import com.bulletjournal.controller.models.ProjectSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectSettingRepository extends JpaRepository<ProjectSetting, Long> {
}