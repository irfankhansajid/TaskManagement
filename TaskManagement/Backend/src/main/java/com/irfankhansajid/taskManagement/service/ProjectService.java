package com.irfankhansajid.taskManagement.service;

import java.util.List;

import com.irfankhansajid.taskManagement.model.Project;

public interface ProjectService {
    Project createProject(Project project);
    Project getProjectById(Long id);
    Project updateProject(Project project);
    void deleteProject(Long id);
    List<Project> getAllProjects();
    
    List<Project> getProjectsByOwner(Long userId);
    Project addTaskToProject(Long projectId, Long taskId);
    Project removeTaskFromProject(Long projectId, Long taskId);

    List<Project> searchProjectsByName(String keyword);
} 
