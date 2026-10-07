package com.forgex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/github")
public class GitHubController {

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getGitHubStatus() {
        return ResponseEntity.ok(Map.of(
                "connected", true,
                "account", "forgex-developer",
                "rateLimitRemaining", 4980,
                "activeWebhook", "https://api.forgex.io/webhooks/github"
        ));
    }

    @PostMapping("/pull-request")
    public ResponseEntity<Map<String, Object>> createPullRequest(@RequestBody Map<String, Object> prPayload) {
        String title = (String) prPayload.getOrDefault("title", "AI: Implement requested feature");
        String branch = (String) prPayload.getOrDefault("branch", "feature/forgex-ai-gen");
        int trustScore = ((Number) prPayload.getOrDefault("trustScore", 87)).intValue();

        return ResponseEntity.ok(Map.of(
                "prNumber", 42,
                "prUrl", "https://github.com/forgex-demo/foodieflow/pull/42",
                "title", title,
                "branch", branch,
                "trustScoreBadge", "https://img.shields.io/badge/ForgeX%20Trust%20Score-" + trustScore + "%2F100-brightgreen",
                "ciStatus", "TRIGGERED_SUCCESSFULLY",
                "status", "OPEN"
        ));
    }
}
