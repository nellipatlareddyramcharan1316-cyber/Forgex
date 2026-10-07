package com.forgex.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "repositories")
public class RepositoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    @Column(name = "repo_url", nullable = false, length = 512)
    private String repoUrl;

    @Column(name = "default_branch", length = 64)
    private String defaultBranch = "main";

    @Column(length = 64)
    private String language = "Java";

    @Column(name = "last_synced_at")
    private Instant lastSyncedAt = Instant.now();

    public RepositoryEntity() {}

    public RepositoryEntity(ProjectEntity project, String repoUrl, String defaultBranch, String language) {
        this.project = project;
        this.repoUrl = repoUrl;
        this.defaultBranch = defaultBranch != null ? defaultBranch : "main";
        this.language = language != null ? language : "Java";
        this.lastSyncedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectEntity getProject() { return project; }
    public void setProject(ProjectEntity project) { this.project = project; }

    public String getRepoUrl() { return repoUrl; }
    public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }

    public String getDefaultBranch() { return defaultBranch; }
    public void setDefaultBranch(String defaultBranch) { this.defaultBranch = defaultBranch; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Instant getLastSyncedAt() { return lastSyncedAt; }
    public void setLastSyncedAt(Instant lastSyncedAt) { this.lastSyncedAt = lastSyncedAt; }
}
