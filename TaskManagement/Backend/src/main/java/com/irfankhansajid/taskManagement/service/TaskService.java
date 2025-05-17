package com.irfankhansajid.taskManagement.service;

import java.util.List;

import com.irfankhansajid.taskManagement.model.Priority;
import com.irfankhansajid.taskManagement.model.Status;
import com.irfankhansajid.taskManagement.model.Task;

public interface TaskService {

    
    Task createTask(Task task);
    Task getTaskById(Long id);
    Task updateTask(Task task);
    void deleteTask(Long id);
    List<Task> getAllTasks();


    Task assignTaskToUser(Long taskId, Long userId);
    Task updateTaskStatus(Long taskId, Status status);
    Task updateTaskPriority(Long taskId, Priority priority);


    List<Task> getTasksByStatus(Status status);
    List<Task> getTasksByPriority(Priority priority);
    List<Task> getTasksByUser(Long userId);
    List<Task> getTasksByProject(Long projectId);
    List<Task> getOverdueTasks();

    
}
