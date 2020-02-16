package com.bulletjournal.repository;

import com.bulletjournal.controller.models.CreateTaskParams;
import com.bulletjournal.controller.models.UpdateTaskParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class TaskDaoJpa {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Task> getTasks(Long projectId) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));
        return this.taskRepository.findTaskByProject(project);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task create(Long projectId, String owner, CreateTaskParams createTaskParams) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        Task task = new Task();
        task.setProject(project);
        task.setAssignedTo(owner);
        task.setDueDate(createTaskParams.getDueDate());
        task.setDueTime(createTaskParams.getDueTime());
        task.setCreatedBy(owner);
        task.setName(createTaskParams.getName());
        return this.taskRepository.save(task);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Task partialUpdate(String owner, Long taskId, UpdateTaskParams updateTaskParams) {
        Task task = this.taskRepository
                .findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task " + taskId + " not found"));

        DaoHelper.updateIfPresent(
                updateTaskParams.hasName(), updateTaskParams.getName(), (value) -> task.setName(value));

        DaoHelper.updateIfPresent(
                updateTaskParams.hasAssignedTo(), updateTaskParams.getAssignedTo(),
                (value) -> task.setAssignedTo(value));

        DaoHelper.updateIfPresent(
                updateTaskParams.hasDueDate(), updateTaskParams.getDueDate(), (value) -> task.setDueDate(value));

        DaoHelper.updateIfPresent(
                updateTaskParams.hasDueTime(), updateTaskParams.getDueTime(), (value) -> task.setDueTime(value));

        return this.taskRepository.save(task);
    }

}
