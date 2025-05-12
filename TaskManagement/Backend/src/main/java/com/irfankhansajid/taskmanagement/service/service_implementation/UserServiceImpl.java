package com.irfankhansajid.taskmanagement.service.service_implementation;

import com.irfankhansajid.taskmanagement.exceptions.DuplicatedResourceException;
import com.irfankhansajid.taskmanagement.exceptions.ResourceNotFoundException;
import com.irfankhansajid.taskmanagement.exceptions.ValidationExcption;
import com.irfankhansajid.taskmanagement.model.Role;
import com.irfankhansajid.taskmanagement.model.Status;
import com.irfankhansajid.taskmanagement.model.User;
import com.irfankhansajid.taskmanagement.repository.UserRepository;
import com.irfankhansajid.taskmanagement.service.UserService;
import com.irfankhansajid.validation.UserValidator;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserValidator userValidator;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
    UserValidator userValidator) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userValidator = userValidator;
    }


    @Override
    public User registerUser(User user) {

        // User data validate

        userValidator.validateUser(user);
        
        // Check duplicate
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicatedResourceException("Username already exists");
        }
        // Check for duplicate email
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicatedResourceException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRole(Role.USER);
        user.setStatus(Status.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    @Override
    public User authenticateUser(String username, String password) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ValidationExcption("Invalid password");
        }

        return user;
    }
   
    @Override
    public User getUserById(Long id) {
       return userRepository.findById(id).orElseThrow(() -> 
       new ResourceNotFoundException("User not found"));
    }

    @Override
    public User updateUser(User user) {
        User existingUser = getUserById(user.getId());

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setUpdatedAt(LocalDateTime.now());

        // if assword is being updated
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)){
            throw new ResourceNotFoundException("User Not Found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserByUserName(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }



    
}