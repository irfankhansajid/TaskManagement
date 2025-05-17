package com.irfankhansajid.taskManagement.controller;

import com.irfankhansajid.taskManagement.model.Project;
import com.irfankhansajid.taskManagement.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        project.setId(id);
        return ResponseEntity.ok(projectService.updateProject(project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/owner/{userId}")
    public ResponseEntity<List<Project>> getProjectsByOwner(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.getProjectsByOwner(userId));
    }

    @PostMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<Project> addTaskToProject(@PathVariable Long projectId, @PathVariable Long taskId) {
        return ResponseEntity.ok(projectService.addTaskToProject(projectId, taskId));
    }

    @DeleteMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<Project> removeTaskFromProject(@PathVariable Long projectId, @PathVariable Long taskId) {
        return ResponseEntity.ok(projectService.removeTaskFromProject(projectId, taskId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjectsByName(@RequestParam String name) {
        return ResponseEntity.ok(projectService.searchProjectsByName(name));
    }
}
