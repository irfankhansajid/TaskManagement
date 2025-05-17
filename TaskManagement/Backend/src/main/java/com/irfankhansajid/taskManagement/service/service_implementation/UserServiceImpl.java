package com.irfankhansajid.taskManagement.service.service_implementation;
    
import com.irfankhansajid.taskManagement.exceptions.DuplicatedResourceException;
import com.irfankhansajid.taskManagement.exceptions.ResourceNotFoundException;
import com.irfankhansajid.taskManagement.exceptions.ValidationException;
import com.irfankhansajid.taskManagement.model.Role;
import com.irfankhansajid.taskManagement.model.Status;
import com.irfankhansajid.taskManagement.model.User;
import com.irfankhansajid.taskManagement.repository.UserRepository;
import com.irfankhansajid.taskManagement.service.EmailService;
import com.irfankhansajid.taskManagement.service.UserService;
import com.irfankhansajid.taskManagement.validation.UserValidator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserValidator userValidator;
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
    UserValidator userValidator, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userValidator = userValidator;
        this.emailService = emailService;
    }


    @Override
    public User registerUser(User user) {

        // User data validate

        userValidator.validateUser(user);
        
        
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

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ValidationException("Invalid password");
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


    
        @Override
        public void sendPasswordResetEmail(String email) {
            User user = getUserByEmail(email);
            String resetToken = generateResetToken();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
            userRepository.save(user);
            
          
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        }
    
        @Override
        public void resetPassword(String email, String token, String newPassword) {
            User user = getUserByEmail(email);
            if (!user.getResetToken().equals(token) || 
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new ValidationException("Invalid or expired reset token");
            }
            
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
        }
    
        @Override
        public void verifyEmail(String token) {
            User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new ValidationException("Invalid verification token"));
            
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null);
            userRepository.save(user);
        }
    
        @Override
        public void resendVerificationEmail(String email) {
            User user = getUserByEmail(email);
            if (user.isEmailVerified()) {
                throw new ValidationException("Email already verified");
            }
            
            String verificationToken = generateVerificationToken();
            user.setEmailVerificationToken(verificationToken);
            userRepository.save(user);
            
            
            emailService.sendVerificationEmail(user.getEmail(), verificationToken);
        }
    
        private String generateResetToken() {
            return UUID.randomUUID().toString();
        }
    
        private String generateVerificationToken() {
            return UUID.randomUUID().toString();
        }
    

    
}