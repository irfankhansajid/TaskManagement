package com.irfankhansajid.taskManagement.repository;

import com.irfankhansajid.taskManagement.model.Priority;
import com.irfankhansajid.taskManagement.model.Status;
import com.irfankhansajid.taskManagement.model.Task;
import com.irfankhansajid.taskManagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByAssignedTo(User user);
    
    List<Task> findByStatus(Status status);
    
    List<Task> findByPriority(Priority priority);
    
    List<Task> findByDueDateBefore(LocalDateTime date);
    
    List<Task> findByProjectId(Long projectId);
    
    List<Task> findByAssignedToAndStatus(User user, Status status);
} 