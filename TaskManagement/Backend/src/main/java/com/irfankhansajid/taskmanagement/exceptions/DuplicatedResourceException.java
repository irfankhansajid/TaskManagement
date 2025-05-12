package com.irfankhansajid.taskmanagement.exceptions;

public class DuplicatedResourceException extends RuntimeException {
    public DuplicatedResourceException(String message) {
        super(message);
    }
}
