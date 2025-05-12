package com.irfankhansajid.taskmanagement.repository;

import com.irfankhansajid.taskmanagement.model.Project;
import com.irfankhansajid.taskmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByOwner(User owner);
    
    List<Project> findByNameContaining(String name);
} 