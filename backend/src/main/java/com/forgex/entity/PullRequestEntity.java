package com.forgex.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pull_requests")
public class PullRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "task_id")
    private TaskEntity task;

    @Column(name = "pr_number", nullable = false)
    private Integer prNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 255)
    private String branch;

    @Column(length = 32)
    private String status = "OPEN";

    @Column(name = "trust_score")
    private Integer trustScore = 87;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public PullRequestEntity() {}

    public PullRequestEntity(ProjectEntity project, TaskEntity task, Integer prNumber, String title, String branch, Integer trustScore) {
        this.project = project;
        this.task = task;
        this.prNumber = prNumber;
        this.title = title;
        this.branch = branch;
        this.trustScore = trustScore != null ? trustScore : 87;
        this.status = "OPEN";
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectEntity getProject() { return project; }
    public void setProject(ProjectEntity project) { this.project = project; }

    public TaskEntity getTask() { return task; }
    public void setTask(TaskEntity task) { this.task = task; }

    public Integer getPrNumber() { return prNumber; }
    public void setPrNumber(Integer prNumber) { this.prNumber = prNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
