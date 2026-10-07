package com.forgex.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "deployments")
public class DeploymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    @Column(nullable = false, length = 64)
    private String environment = "PRODUCTION"; // STAGING, PRODUCTION

    @Column(nullable = false, length = 64)
    private String version = "v1.0.0";

    @Column(nullable = false, length = 32)
    private String status = "HEALTHY"; // HEALTHY, DEGRADED, FAILED

    @Column(name = "response_time_ms")
    private Double responseTimeMs = 182.0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public DeploymentEntity() {}

    public DeploymentEntity(ProjectEntity project, String environment, String version, String status, Double responseTimeMs) {
        this.project = project;
        this.environment = environment;
        this.version = version;
        this.status = status;
        this.responseTimeMs = responseTimeMs;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectEntity getProject() { return project; }
    public void setProject(ProjectEntity project) { this.project = project; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getResponseTimeMs() { return responseTimeMs; }
    public void setResponseTimeMs(Double responseTimeMs) { this.responseTimeMs = responseTimeMs; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
