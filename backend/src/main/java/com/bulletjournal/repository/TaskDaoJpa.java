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
    public Task create(Long projectId, String assignedTo, String dueDate, String dueTime, String createdBy, String name) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        Task task = new Task();
        task.setProject(project);
        task.setAssignedTo(assignedTo);
        task.setDueDate(dueDate);
        task.setDueTime(dueTime);
        task.setCreatedBy(createdBy);
        task.setName(name);
        return this.taskRepository.save(task);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task update(Long taskId, String assignedTo, String dueDate, String dueTime, String createdBy, String name) {
        Task task = this.taskRepository
                .findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + projectId + " not found"));

        return this.taskRepository.save(task);
    }

}
