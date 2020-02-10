package com.bulletjournal.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class TaskDaoJpa {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task create(Long projectId, String assignedTo, String name, String createdBy) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        Task task = new Task();
        task.setProject(project);
        task.setAssignedTo(assignedTo);
        task.setName(name);
        task.setCreatedBy(createdBy);
        return this.taskRepository.save(task);
    }
}
