package com.forgex.model;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class TrustScoreResult {
    private String id;
    private String taskKey;
    private int overallScore;
    private String verdict; // SAFE TO REVIEW, REQUIRES APPROVAL, BLOCKED
    private String badgeColor; // green, yellow, red
    private boolean isSafeToDeploy;
    private String summaryMessage;
    private Map<String, Object> breakdown;
    private Instant calculatedAt;

    public TrustScoreResult() {
        this.calculatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTaskKey() { return taskKey; }
    public void setTaskKey(String taskKey) { this.taskKey = taskKey; }

    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public boolean isSafeToDeploy() { return isSafeToDeploy; }
    public void setSafeToDeploy(boolean safeToDeploy) { isSafeToDeploy = safeToDeploy; }

    public String getSummaryMessage() { return summaryMessage; }
    public void setSummaryMessage(String summaryMessage) { this.summaryMessage = summaryMessage; }

    public Map<String, Object> getBreakdown() { return breakdown; }
    public void setBreakdown(Map<String, Object> breakdown) { this.breakdown = breakdown; }

    public Instant getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(Instant calculatedAt) { this.calculatedAt = calculatedAt; }
}
