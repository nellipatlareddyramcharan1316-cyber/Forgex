package com.forgex.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "trust_scores")
public class TrustScoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_key", nullable = false, length = 64)
    private String taskKey;

    @Column(name = "overall_score", nullable = false)
    private Integer overallScore;

    @Column(nullable = false, length = 64)
    private String verdict;

    @Column(name = "badge_color", length = 32)
    private String badgeColor;

    @Column(name = "safe_to_deploy", nullable = false)
    private Boolean safeToDeploy;

    @Column(name = "summary_message", length = 1000)
    private String summaryMessage;

    @Column(name = "unit_test_score")
    private Double unitTestScore;

    @Column(name = "integration_test_score")
    private Double integrationTestScore;

    @Column(name = "security_score")
    private Double securityScore;

    @Column(name = "secrets_score")
    private Double secretsScore;

    @Column(name = "dependency_score")
    private Double dependencyScore;

    @Column(name = "requirement_coverage")
    private Double requirementCoverage;

    @Column(name = "code_quality_score")
    private Double codeQualityScore;

    @Column(name = "calculated_at", nullable = false, updatable = false)
    private Instant calculatedAt = Instant.now();

    public TrustScoreEntity() {}

    public TrustScoreEntity(
            String taskKey,
            Integer overallScore,
            String verdict,
            String badgeColor,
            Boolean safeToDeploy,
            String summaryMessage,
            Double unitTestScore,
            Double integrationTestScore,
            Double securityScore,
            Double secretsScore,
            Double dependencyScore,
            Double requirementCoverage,
            Double codeQualityScore
    ) {
        this.taskKey = taskKey;
        this.overallScore = overallScore;
        this.verdict = verdict;
        this.badgeColor = badgeColor;
        this.safeToDeploy = safeToDeploy;
        this.summaryMessage = summaryMessage;
        this.unitTestScore = unitTestScore;
        this.integrationTestScore = integrationTestScore;
        this.securityScore = securityScore;
        this.secretsScore = secretsScore;
        this.dependencyScore = dependencyScore;
        this.requirementCoverage = requirementCoverage;
        this.codeQualityScore = codeQualityScore;
        this.calculatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTaskKey() { return taskKey; }
    public void setTaskKey(String taskKey) { this.taskKey = taskKey; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public Boolean getSafeToDeploy() { return safeToDeploy; }
    public void setSafeToDeploy(Boolean safeToDeploy) { this.safeToDeploy = safeToDeploy; }

    public String getSummaryMessage() { return summaryMessage; }
    public void setSummaryMessage(String summaryMessage) { this.summaryMessage = summaryMessage; }

    public Double getUnitTestScore() { return unitTestScore; }
    public void setUnitTestScore(Double unitTestScore) { this.unitTestScore = unitTestScore; }

    public Double getIntegrationTestScore() { return integrationTestScore; }
    public void setIntegrationTestScore(Double integrationTestScore) { this.integrationTestScore = integrationTestScore; }

    public Double getSecurityScore() { return securityScore; }
    public void setSecurityScore(Double securityScore) { this.securityScore = securityScore; }

    public Double getSecretsScore() { return secretsScore; }
    public void setSecretsScore(Double secretsScore) { this.secretsScore = secretsScore; }

    public Double getDependencyScore() { return dependencyScore; }
    public void setDependencyScore(Double dependencyScore) { this.dependencyScore = dependencyScore; }

    public Double getRequirementCoverage() { return requirementCoverage; }
    public void setRequirementCoverage(Double requirementCoverage) { this.requirementCoverage = requirementCoverage; }

    public Double getCodeQualityScore() { return codeQualityScore; }
    public void setCodeQualityScore(Double codeQualityScore) { this.codeQualityScore = codeQualityScore; }

    public Instant getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(Instant calculatedAt) { this.calculatedAt = calculatedAt; }
}
