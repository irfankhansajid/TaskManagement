package com.irfankhansajid.taskManagement.repository;

import com.irfankhansajid.taskManagement.model.Project;
import com.irfankhansajid.taskManagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByOwner(User owner);
    
    List<Project> findByNameContaining(String name);
} 