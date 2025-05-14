package com.irfankhansajid.validation;

import org.springframework.stereotype.Component;

import com.irfankhansajid.taskmanagement.exceptions.ValidationException;
import com.irfankhansajid.taskmanagement.model.Project;

@Component
public class ProjectValidator {
    public void validateProject(Project project) {
        if (project.getName() == null || project.getName().isEmpty()) {
            throw new ValidationException("Project name is required");
        }
        
        if (project.getOwner() == null) {
            throw new ValidationException("Project owner is required");
        }   
        
    }
}