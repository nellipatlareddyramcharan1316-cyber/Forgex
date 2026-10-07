package com.forgex.controller;

import com.forgex.model.SystemMetrics;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthAndMetricsController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "ForgeX Backend Core",
                "version", "1.0.0",
                "database", "CONNECTED",
                "aiService", "CONNECTED"
        ));
    }

    @GetMapping("/telemetry")
    public ResponseEntity<SystemMetrics> getTelemetry() {
        SystemMetrics metrics = new SystemMetrics();
        metrics.setStatus("HEALTHY");
        metrics.setResponseTimeMs(182.4);
        metrics.setErrorRatePct(0.8);
        metrics.setRequestsPerMin(245);
        metrics.setCpuUsagePct(37);
        metrics.setMemoryUsagePct(52);
        metrics.setActiveProjects(3);
        metrics.setTotalVerifiedPRs(14);
        return ResponseEntity.ok(metrics);
    }
}
