package com.irfankhansajid.validation;

import org.springframework.stereotype.Component;

import com.irfankhansajid.taskmanagement.exceptions.ValidationException;
import com.irfankhansajid.taskmanagement.model.User;


@Component
public class UserValidator {
    
    public void validateUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new ValidationException("Username is Required");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new ValidationException("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new ValidationException("Password is required");
        }
        if (user.getPassword().length() < 6) {
            throw new ValidationException("Password must be at least 6 characters");
    }
    if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
        throw new ValidationException("Invalid email format");
    }
}

}
