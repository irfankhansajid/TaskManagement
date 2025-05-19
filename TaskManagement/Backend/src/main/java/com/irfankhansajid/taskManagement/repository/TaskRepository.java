package com.irfankhansajid.taskManagement.repository;

import com.irfankhansajid.taskManagement.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByAssignedTo(User user);
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByPriority(Priority priority);
    
    List<Task> findByDueDateBefore(LocalDate date);
    
    List<Task> findByProjectId(Long projectId);
    
    List<Task> findByAssignedToAndStatus(User user, TaskStatus status);
} 