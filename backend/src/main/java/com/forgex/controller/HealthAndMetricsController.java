package com.forgex.controller;

import com.forgex.model.SystemMetrics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthAndMetricsController {

    private final DataSource dataSource;
    private final String aiServiceUrl;
    private final RestClient restClient;

    public HealthAndMetricsController(
            @Autowired(required = false) DataSource dataSource,
            @Value("${forgex.ai-service.url:http://localhost:8000}") String aiServiceUrl
    ) {
        this.dataSource = dataSource;
        this.aiServiceUrl = aiServiceUrl;
        this.restClient = RestClient.builder().build();
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        String dbStatus = "DISCONNECTED";
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection()) {
                if (conn.isValid(2)) {
                    dbStatus = "CONNECTED";
                }
            } catch (Exception e) {
                dbStatus = "ERROR";
            }
        }

        String aiStatus = "DISCONNECTED";
        try {
            ResponseEntity<?> resp = restClient.get()
                    .uri(aiServiceUrl + "/health")
                    .retrieve()
                    .toBodilessEntity();
            if (resp.getStatusCode().is2xxSuccessful()) {
                aiStatus = "CONNECTED";
            }
        } catch (Exception e) {
            aiStatus = "UNREACHABLE";
        }

        Map<String, Object> statusMap = new LinkedHashMap<>();
        statusMap.put("status", "CONNECTED".equals(dbStatus) ? "UP" : "DEGRADED");
        statusMap.put("service", "ForgeX Backend Core");
        statusMap.put("version", "1.0.0");
        statusMap.put("database", dbStatus);
        statusMap.put("aiService", aiStatus);

        return ResponseEntity.ok(statusMap);
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
