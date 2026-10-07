package com.forgex.model;

import java.time.Instant;
import java.util.List;

public class Task {
    private String id;
    private String projectId;
    private String storyKey;
    private String epicName;
    private String title;
    private String description;
    private List<String> acceptanceCriteria;
    private String status; // BACKLOG, IN_PROGRESS, IN_REVIEW, DONE
    private Instant createdAt;

    public Task() {
        this.createdAt = Instant.now();
        this.status = "BACKLOG";
    }

    public Task(String id, String projectId, String storyKey, String epicName, String title, String description, List<String> acceptanceCriteria) {
        this();
        this.id = id;
        this.projectId = projectId;
        this.storyKey = storyKey;
        this.epicName = epicName;
        this.title = title;
        this.description = description;
        this.acceptanceCriteria = acceptanceCriteria;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getStoryKey() { return storyKey; }
    public void setStoryKey(String storyKey) { this.storyKey = storyKey; }

    public String getEpicName() { return epicName; }
    public void setEpicName(String epicName) { this.epicName = epicName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getAcceptanceCriteria() { return acceptanceCriteria; }
    public void setAcceptanceCriteria(List<String> acceptanceCriteria) { this.acceptanceCriteria = acceptanceCriteria; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
