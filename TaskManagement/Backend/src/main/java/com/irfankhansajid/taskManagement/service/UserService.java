package com.irfankhansajid.taskManagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.irfankhansajid.taskManagement.model.User;

@Service
public interface UserService {

    User registerUser(User user);

    User authenticateUser(String username, String password);

    User getUserById(Long id);

    User updateUser(User user);

    void deleteUser(Long id);

    List<User> getAllUsers();

    User getUserByUserName(String username);

    User getUserByEmail(String email);

    void sendPasswordResetEmail(String email);
    void resetPassword(String email, String token, String newPassword);
    void verifyEmail(String token);
    void resendVerificationEmail(String email);



} 
