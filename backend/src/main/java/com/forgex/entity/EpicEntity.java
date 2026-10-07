package com.forgex.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "epics")
public class EpicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    @Column(name = "epic_key", nullable = false, length = 32)
    private String epicKey;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public EpicEntity() {}

    public EpicEntity(ProjectEntity project, String epicKey, String name, String description) {
        this.project = project;
        this.epicKey = epicKey;
        this.name = name;
        this.description = description;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectEntity getProject() { return project; }
    public void setProject(ProjectEntity project) { this.project = project; }

    public String getEpicKey() { return epicKey; }
    public void setEpicKey(String epicKey) { this.epicKey = epicKey; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
