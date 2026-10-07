package com.forgex.model;

import java.time.Instant;

public class SystemMetrics {
    private String status;
    private double responseTimeMs;
    private double errorRatePct;
    private int requestsPerMin;
    private int cpuUsagePct;
    private int memoryUsagePct;
    private int activeProjects;
    private int totalVerifiedPRs;
    private Instant timestamp;

    public SystemMetrics() {
        this.timestamp = Instant.now();
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getResponseTimeMs() { return responseTimeMs; }
    public void setResponseTimeMs(double responseTimeMs) { this.responseTimeMs = responseTimeMs; }

    public double getErrorRatePct() { return errorRatePct; }
    public void setErrorRatePct(double errorRatePct) { this.errorRatePct = errorRatePct; }

    public int getRequestsPerMin() { return requestsPerMin; }
    public void setRequestsPerMin(int requestsPerMin) { this.requestsPerMin = requestsPerMin; }

    public int getCpuUsagePct() { return cpuUsagePct; }
    public void setCpuUsagePct(int cpuUsagePct) { this.cpuUsagePct = cpuUsagePct; }

    public int getMemoryUsagePct() { return memoryUsagePct; }
    public void setMemoryUsagePct(int memoryUsagePct) { this.memoryUsagePct = memoryUsagePct; }

    public int getActiveProjects() { return activeProjects; }
    public void setActiveProjects(int activeProjects) { this.activeProjects = activeProjects; }

    public int getTotalVerifiedPRs() { return totalVerifiedPRs; }
    public void setTotalVerifiedPRs(int totalVerifiedPRs) { this.totalVerifiedPRs = totalVerifiedPRs; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
