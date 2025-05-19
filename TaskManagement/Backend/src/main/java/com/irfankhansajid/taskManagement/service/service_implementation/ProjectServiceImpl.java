package com.irfankhansajid.taskManagement.service.service_implementation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.irfankhansajid.taskManagement.exceptions.ResourceNotFoundException;
import com.irfankhansajid.taskManagement.model.Project;
import com.irfankhansajid.taskManagement.model.Task;
import com.irfankhansajid.taskManagement.model.User;
import com.irfankhansajid.taskManagement.repository.ProjectRepository;
import com.irfankhansajid.taskManagement.repository.TaskRepository;
import com.irfankhansajid.taskManagement.repository.UserRepository;
import com.irfankhansajid.taskManagement.service.ProjectService;
import com.irfankhansajid.taskManagement.validation.ProjectValidator;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;
    private final ProjectValidator projectValidator;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository, UserRepository userRepository, TaskRepository taskRepository, ProjectValidator projectValidator) {
        this.projectRepository = projectRepository;
        this.projectValidator = projectValidator;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }


    @Override
    public Project createProject(Project project) {
       
        projectValidator.validateProject(project);
        
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        return projectRepository.save(project);
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
        Project existingProject = getProjectById(project.getId());

        projectValidator.validateProject(project);


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
        task.setProject(project);

        taskRepository.save(task);
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
