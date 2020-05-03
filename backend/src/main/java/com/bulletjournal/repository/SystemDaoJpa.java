package com.bulletjournal.repository;

import com.bulletjournal.repository.models.ProjectItemModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class SystemDaoJpa {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskContentRepository taskContentRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<ProjectItemModel> getRecentItems(Integer weekNum) {
        return null;
    }
}
