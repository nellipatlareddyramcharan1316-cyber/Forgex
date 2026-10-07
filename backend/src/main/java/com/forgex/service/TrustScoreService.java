package com.forgex.service;

import com.forgex.model.TrustScoreResult;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TrustScoreService {

    private final Map<String, TrustScoreResult> cache = new ConcurrentHashMap<>();

    public TrustScoreService() {
        // Seed initial benchmark score
        TrustScoreResult benchmark = new TrustScoreResult();
        benchmark.setId("ts-seed-01");
        benchmark.setTaskKey("US-104");
        benchmark.setOverallScore(87);
        benchmark.setVerdict("SAFE TO REVIEW");
        benchmark.setBadgeColor("green");
        benchmark.setSafeToDeploy(true);
        benchmark.setSummaryMessage("Verified 24/24 unit tests, 0 critical security issues, 92% requirement coverage.");
        benchmark.setBreakdown(Map.of(
                "unitTests", Map.of("passed", 24, "total", 24, "score", 25.0),
                "integrationTests", Map.of("passed", 4, "total", 4, "score", 15.0),
                "securityVulnerabilities", Map.of("critical", 0, "high", 0, "score", 20.0),
                "secretsDetected", Map.of("detected", 0, "score", 15.0),
                "dependencyRisk", Map.of("medium", 1, "score", 7.0),
                "requirementCoverage", Map.of("percentage", 92.0, "score", 9.2),
                "codeQuality", Map.of("score", 4.8)
        ));
        cache.put(benchmark.getTaskKey(), benchmark);
    }

    public TrustScoreResult calculateScore(
            String taskKey,
            int unitPassed, int unitTotal,
            int intPassed, int intTotal,
            int criticalVulns, int highVulns, int medVulns,
            int secretsDetected,
            double requirementCoveragePct
    ) {
        double unitScore = (unitTotal > 0) ? ((double) unitPassed / unitTotal) * 25.0 : 25.0;
        double intScore = (intTotal > 0) ? ((double) intPassed / intTotal) * 15.0 : 15.0;

        double secScore;
        if (criticalVulns > 0) secScore = 0.0;
        else if (highVulns > 0) secScore = 5.0;
        else if (medVulns > 0) secScore = 15.0;
        else secScore = 20.0;

        double secretsScore = (secretsDetected > 0) ? 0.0 : 15.0;
        double depScore = Math.max(0.0, 10.0 - (medVulns * 3.0));
        double reqScore = Math.min(10.0, Math.max(0.0, (requirementCoveragePct / 100.0) * 10.0));
        double qualityScore = 4.8;

        double total = unitScore + intScore + secScore + secretsScore + depScore + reqScore + qualityScore;

        boolean hardBlocked = false;
        String reason = "";

        if (criticalVulns > 0) {
            total = Math.min(total, 25.0);
            hardBlocked = true;
            reason = "CRITICAL SECURITY VULNERABILITY DETECTED";
        } else if (secretsDetected > 0) {
            total = Math.min(total, 20.0);
            hardBlocked = true;
            reason = "HARDCODED SECRETS FOUND IN COMMIT DIFF";
        } else if ((double) unitPassed / Math.max(1, unitTotal) < 0.8) {
            total = Math.min(total, 50.0);
            hardBlocked = true;
            reason = "UNIT TESTS FAILED TO PASS MINIMUM 80% THRESHOLD";
        }

        int finalScore = (int) Math.round(total);
        finalScore = Math.max(0, Math.min(100, finalScore));

        String verdict;
        String color;
        boolean canDeploy;
        String msg;

        if (hardBlocked || finalScore < 65) {
            verdict = "BLOCKED - INSECURE";
            color = "red";
            canDeploy = false;
            msg = "Deployment blocked: " + (reason.isEmpty() ? "Trust Score below acceptable threshold (65)" : reason);
        } else if (finalScore >= 85) {
            verdict = "SAFE TO REVIEW";
            color = "green";
            canDeploy = true;
            msg = "Automated verification successful. Ready for human review and CI/CD promotion.";
        } else {
            verdict = "REQUIRES APPROVAL";
            color = "yellow";
            canDeploy = true;
            msg = "Core tests passed. Medium dependency warning requires senior engineer sign-off.";
        }

        TrustScoreResult result = new TrustScoreResult();
        result.setId("ts-" + UUID.randomUUID().toString().substring(0, 8));
        result.setTaskKey(taskKey != null ? taskKey : "GEN-TASK");
        result.setOverallScore(finalScore);
        result.setVerdict(verdict);
        result.setBadgeColor(color);
        result.setSafeToDeploy(canDeploy);
        result.setSummaryMessage(msg);
        result.setBreakdown(Map.of(
                "unitTests", Map.of("passed", unitPassed, "total", unitTotal, "score", Math.round(unitScore * 10.0) / 10.0),
                "integrationTests", Map.of("passed", intPassed, "total", intTotal, "score", Math.round(intScore * 10.0) / 10.0),
                "securityVulnerabilities", Map.of("critical", criticalVulns, "high", highVulns, "score", secScore),
                "secretsDetected", Map.of("detected", secretsDetected, "score", secretsScore),
                "dependencyRisk", Map.of("medium", medVulns, "score", depScore),
                "requirementCoverage", Map.of("percentage", requirementCoveragePct, "score", Math.round(reqScore * 10.0) / 10.0),
                "codeQuality", Map.of("score", qualityScore)
        ));

        cache.put(result.getTaskKey(), result);
        return result;
    }

    public Optional<TrustScoreResult> getScoreByTaskKey(String taskKey) {
        return Optional.ofNullable(cache.get(taskKey));
    }
}
