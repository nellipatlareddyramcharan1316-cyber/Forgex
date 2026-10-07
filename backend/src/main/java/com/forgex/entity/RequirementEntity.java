package com.forgex.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "requirements")
public class RequirementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    @Column(name = "raw_prompt", columnDefinition = "TEXT", nullable = false)
    private String rawPrompt;

    @Column(name = "architecture_summary", columnDefinition = "TEXT")
    private String architectureSummary;

    @Column(length = 32)
    private String status = "ANALYZED";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public RequirementEntity() {}

    public RequirementEntity(ProjectEntity project, String rawPrompt, String architectureSummary) {
        this.project = project;
        this.rawPrompt = rawPrompt;
        this.architectureSummary = architectureSummary;
        this.status = "ANALYZED";
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectEntity getProject() { return project; }
    public void setProject(ProjectEntity project) { this.project = project; }

    public String getRawPrompt() { return rawPrompt; }
    public void setRawPrompt(String rawPrompt) { this.rawPrompt = rawPrompt; }

    public String getArchitectureSummary() { return architectureSummary; }
    public void setArchitectureSummary(String architectureSummary) { this.architectureSummary = architectureSummary; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
