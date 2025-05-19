package com.irfankhansajid.taskManagement.validation;

import org.springframework.stereotype.Component;

import com.irfankhansajid.taskManagement.exceptions.ValidationException;
import com.irfankhansajid.taskManagement.model.Project;

@Component
public class ProjectValidator {
    public void validateProject(Project project) {
        if (project.getName() == null || project.getName().isEmpty()) {
            throw new ValidationException("Project name is required");
        }
        if (project.getDescription()  != null && project.getDescription().length() < 5000) {
            throw new ValidationException("Project description must be less than 5000 characters");
        }
        
        if (project.getOwner() == null) {
            throw new ValidationException("Project owner is required");
        }   
        
    }
}