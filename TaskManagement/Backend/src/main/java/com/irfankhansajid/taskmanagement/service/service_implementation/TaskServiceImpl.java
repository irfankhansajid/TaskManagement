package com.irfankhansajid.taskmanagement.service.service_implementation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.irfankhansajid.taskmanagement.exceptions.ResourceNotFoundException;
import com.irfankhansajid.taskmanagement.model.Priority;
import com.irfankhansajid.taskmanagement.model.Status;
import com.irfankhansajid.taskmanagement.model.Task;
import com.irfankhansajid.taskmanagement.repository.TaskRepository;
import com.irfankhansajid.taskmanagement.repository.UserRepository;
import com.irfankhansajid.taskmanagement.service.TaskService;
import com.irfankhansajid.validation.TaskValidator;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskValidator taskValidator;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository, TaskValidator taskValidator) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskValidator = taskValidator;
    }

    @Override
    public Task createTask(Task task) {
        taskValidator.validateTask(task);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }


    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow( () -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    @Override
    public Task updateTask(Task task) {
        Task existingTask = getTaskById(task.getId());
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
       
        existingTask.setStatus(task.getStatus());
        existingTask.setPriority(task.getPriority());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task assignTaskToUser(Long taskId, Long userId) {
        Task task = getTaskById(taskId);
        com.irfankhansajid.taskmanagement.model.User user = userRepository.findById(userId)
        .orElseThrow( () -> new ResourceNotFoundException("User not found with id: " + userId));
        task.setAssignedTo(user);
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskStatus(Long taskId, Status status) {
        Task task = getTaskById(taskId);
        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskPriority(Long taskId, Priority priority) {
        Task task = getTaskById(taskId);
        task.setPriority(priority);
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByStatus(Status status) {
        return taskRepository.findByStatus(status);
    }

    @Override
    public List<Task> getTasksByPriority(Priority priority) {
        return taskRepository.findByPriority(priority);
    }

    @Override
    public List<Task> getTasksByUser(Long userId) {
        com.irfankhansajid.taskmanagement.model.User user = userRepository.findById(userId)
        .orElseThrow( () -> new ResourceNotFoundException("User not found with id: " + userId));
        return taskRepository.findByAssignedTo(user);   
    }

    @Override
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public List<Task> getOverdueTasks() {
        return taskRepository.findByDueDateBefore(LocalDateTime.now());
    }
}
