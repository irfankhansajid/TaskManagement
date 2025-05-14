package com.irfankhansajid.validation;

import com.irfankhansajid.taskmanagement.exceptions.ValidationException;
import com.irfankhansajid.taskmanagement.model.Task;

public class TaskValidator {
    
    public void validateTask(Task task) {
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            throw new ValidationException("Task title is required");
        }
        if (task.getStatus() == null) {
            throw new ValidationException("Task status is required");
        }
        if (task.getPriority() == null) {
            throw new ValidationException("Task priority is required");
        }
        if (task.getDueDate() == null) {
            throw new ValidationException("Due date is required");
        }
    }
}
