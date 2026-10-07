package com.forgex.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "tasks", indexes = {
    @Index(name = "idx_task_project", columnList = "project_id"),
    @Index(name = "idx_task_status", columnList = "status")
})
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private ProjectEntity project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "epic_id")
    @JsonIgnore
    private EpicEntity epic;

    @Column(name = "story_key", nullable = false, length = 32)
    private String storyKey;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "acceptance_criteria", columnDefinition = "TEXT")
    private String acceptanceCriteria;

    @Column(nullable = false, length = 32)
    private String status = "BACKLOG"; // BACKLOG, IN_PROGRESS, IN_REVIEW, DONE

    @Column(length = 32)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public TaskEntity() {}

    public TaskEntity(ProjectEntity project, EpicEntity epic, String storyKey, String title, String description, String status, String priority) {
        this.project = project;
        this.epic = epic;
        this.storyKey = storyKey;
        this.title = title;
        this.description = description;
        this.status = status != null ? status : "BACKLOG";
        this.priority = priority != null ? priority : "MEDIUM";
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectEntity getProject() { return project; }
    public void setProject(ProjectEntity project) { this.project = project; }

    public Long getProjectId() {
        return project != null ? project.getId() : null;
    }

    public EpicEntity getEpic() { return epic; }
    public void setEpic(EpicEntity epic) { this.epic = epic; }

    public String getEpicName() {
        return epic != null ? epic.getName() : null;
    }

    public String getStoryKey() { return storyKey; }
    public void setStoryKey(String storyKey) { this.storyKey = storyKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAcceptanceCriteria() { return acceptanceCriteria; }
    public void setAcceptanceCriteria(String acceptanceCriteria) { this.acceptanceCriteria = acceptanceCriteria; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public User getAssignee() { return assignee; }
    public void setAssignee(User assignee) { this.assignee = assignee; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
