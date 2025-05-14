package com.irfankhansajid.taskmanagement.utils;

import com.irfankhansajid.taskmanagement.model.User;

import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private User user;

    public JwtResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }
}