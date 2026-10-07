package com.forgex.controller;

import com.forgex.model.TrustScoreResult;
import com.forgex.service.TrustScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/trust-scores")
public class TrustScoreController {

    private final TrustScoreService trustScoreService;

    public TrustScoreController(TrustScoreService trustScoreService) {
        this.trustScoreService = trustScoreService;
    }

    @GetMapping("/{taskKey}")
    public ResponseEntity<TrustScoreResult> getScore(@PathVariable String taskKey) {
        return trustScoreService.getScoreByTaskKey(taskKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/calculate")
    public ResponseEntity<TrustScoreResult> calculateScore(@RequestBody Map<String, Object> req) {
        String taskKey = (String) req.getOrDefault("taskKey", "TASK-001");
        int unitPassed = ((Number) req.getOrDefault("unitTestsPassed", 24)).intValue();
        int unitTotal = ((Number) req.getOrDefault("unitTestsTotal", 24)).intValue();
        int intPassed = ((Number) req.getOrDefault("integrationTestsPassed", 4)).intValue();
        int intTotal = ((Number) req.getOrDefault("integrationTestsTotal", 4)).intValue();
        int criticalVulns = ((Number) req.getOrDefault("criticalVulnerabilities", 0)).intValue();
        int highVulns = ((Number) req.getOrDefault("highVulnerabilities", 0)).intValue();
        int medVulns = ((Number) req.getOrDefault("mediumVulnerabilities", 0)).intValue();
        int secretsDetected = ((Number) req.getOrDefault("secretsDetected", 0)).intValue();
        double reqCoverage = ((Number) req.getOrDefault("requirementCoveragePct", 92.0)).doubleValue();

        TrustScoreResult result = trustScoreService.calculateScore(
                taskKey, unitPassed, unitTotal, intPassed, intTotal,
                criticalVulns, highVulns, medVulns, secretsDetected, reqCoverage
        );
        return ResponseEntity.ok(result);
    }
}
