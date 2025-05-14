package com.irfankhansajid.taskmanagement.service.service_implementation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.irfankhansajid.taskmanagement.exceptions.ResourceNotFoundException;
import com.irfankhansajid.taskmanagement.model.Project;
import com.irfankhansajid.taskmanagement.model.Task;
import com.irfankhansajid.taskmanagement.model.User;
import com.irfankhansajid.taskmanagement.repository.ProjectRepository;
import com.irfankhansajid.taskmanagement.repository.TaskRepository;
import com.irfankhansajid.taskmanagement.repository.UserRepository;
import com.irfankhansajid.taskmanagement.service.ProjectService;
import com.irfankhansajid.validation.ProjectValidator;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;
    private final ProjectValidator projectValidator;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository, UserRepository userRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.projectValidator = new ProjectValidator();
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }


    @Override
    public Project createProject(Project project) {
       
        projectValidator.validateProject(project);
        Project newProject = new Project();
        newProject.setName(project.getName());
        newProject.setDescription(project.getDescription());
        newProject.setCreatedAt(LocalDateTime.now());
        newProject.setUpdatedAt(LocalDateTime.now());
        newProject.setOwner(project.getOwner());
        return projectRepository.save(newProject);
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
        .orElseThrow(() -> 
            new ResourceNotFoundException("Project not found with id: " + id)
        );
    }

    @Override
    public Project updateProject(Project project) {
        Project existingProject = new Project();

        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setUpdatedAt(LocalDateTime.now());

        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public List<Project> getProjectsByOwner(Long userId) {
        User owner = userRepository.findById(userId)
        .orElseThrow(() -> 
            new ResourceNotFoundException("User not found with id: " + userId)
        );
        return projectRepository.findByOwner(owner);
    }

    @Override
    public Project addTaskToProject(Long projectId, Long taskId) {
        Project project = getProjectById(projectId);
        Task task = taskRepository.findById(taskId).orElseThrow(() -> 
            new ResourceNotFoundException("Task not found with id: " + taskId)
        );
        project.getTasks().add(task);
        return projectRepository.save(project);
    }

    @Override
    public Project removeTaskFromProject(Long projectId, Long taskId) {
        Project project = getProjectById(projectId);
        Task task = taskRepository.findById(taskId).orElseThrow(() -> 
            new ResourceNotFoundException("Task not found with id: " + taskId)
        );
        project.getTasks().remove(task);
        return projectRepository.save(project);
    }

    @Override
    public List<Project> searchProjectsByName(String keyword) {
        return projectRepository.findByNameContaining(keyword);
    }
    
}
