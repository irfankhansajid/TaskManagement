package com.irfankhansajid.taskManagement.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;


@Data
@Entity
@Table(name = "projects")

public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks = new ArrayList<>();


    



    
    
}
