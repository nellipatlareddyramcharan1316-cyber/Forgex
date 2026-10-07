package com.forgex.model;

import java.time.Instant;
import java.util.List;

public class Project {
    private String id;
    private String name;
    private String description;
    private String repositoryUrl;
    private String defaultBranch;
    private String status;
    private Instant createdAt;

    public Project() {
        this.createdAt = Instant.now();
        this.status = "ACTIVE";
        this.defaultBranch = "main";
    }

    public Project(String id, String name, String description, String repositoryUrl) {
        this();
        this.id = id;
        this.name = name;
        this.description = description;
        this.repositoryUrl = repositoryUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRepositoryUrl() { return repositoryUrl; }
    public void setRepositoryUrl(String repositoryUrl) { this.repositoryUrl = repositoryUrl; }

    public String getDefaultBranch() { return defaultBranch; }
    public void setDefaultBranch(String defaultBranch) { this.defaultBranch = defaultBranch; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
