package com.irfankhansajid.taskManagement.service;

import java.util.List;

import com.irfankhansajid.taskManagement.model.Priority;

import com.irfankhansajid.taskManagement.model.Task;
import com.irfankhansajid.taskManagement.model.TaskStatus;

public interface TaskService {

    
    Task createTask(Task task);
    Task getTaskById(Long id);
    Task updateTask(Task task);
    void deleteTask(Long id);
    List<Task> getAllTasks();


    Task assignTaskToUser(Long taskId, Long userId);
    Task updateTaskStatus(Long taskId, TaskStatus status);
    Task updateTaskPriority(Long taskId, Priority priority);


    List<Task> getTasksByStatus(TaskStatus status);
    List<Task> getTasksByPriority(Priority priority);
    List<Task> getTasksByUser(Long userId);
    List<Task> getTasksByProject(Long projectId);
    List<Task> getOverdueTasks();

    
}
