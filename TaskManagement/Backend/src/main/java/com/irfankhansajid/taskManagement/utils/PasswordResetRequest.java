package com.irfankhansajid.taskManagement.utils;


import lombok.Data;

@Data
public class PasswordResetRequest {
    private String email;
    private String newPassword;
    private String resetToken;

    
}
