package com.bulletjournal.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public class TaskDaoJpa {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task create(Long projectId, String owner, String title, String createdBy) {
        Optional<Project> project = this.projectRepository.findById(projectId);
        if (!project.isPresent()) {
            throw new ResourceNotFoundException("Project " + projectId + " not found");
        }

        Task task = new Task();
        task.setProject(project.get());
        task.setOwner(owner);
        task.setTitle(title);
        task.setCreatedBy(createdBy);
        return this.taskRepository.save(task);
    }
}
