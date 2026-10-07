package com.forgex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/github")
public class GitHubController {

    private boolean isConnected = true;
    private String connectedUser = "forgex-developer";

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getGitHubStatus() {
        return ResponseEntity.ok(Map.of(
                "connected", isConnected,
                "account", connectedUser,
                "rateLimitRemaining", 4980,
                "activeWebhook", "https://api.forgex.io/webhooks/github"
        ));
    }

    @GetMapping("/oauth/url")
    public ResponseEntity<Map<String, String>> getOAuthUrl() {
        return ResponseEntity.ok(Map.of(
                "oauthUrl", "https://github.com/login/oauth/authorize?client_id=forgex_app_id&scope=repo,workflow,read:org"
        ));
    }

    @PostMapping("/oauth/callback")
    public ResponseEntity<Map<String, Object>> handleOAuthCallback(@RequestBody Map<String, String> payload) {
        String code = payload.getOrDefault("code", "demo_code_123");
        this.isConnected = true;
        this.connectedUser = "octocat-engineer";
        return ResponseEntity.ok(Map.of(
                "connected", true,
                "accessToken", "gho_mockToken983428934278912389123",
                "username", this.connectedUser
        ));
    }

    @GetMapping("/repositories")
    public ResponseEntity<List<Map<String, Object>>> listRepositories() {
        List<Map<String, Object>> repos = List.of(
                Map.of(
                        "name", "food-delivery-system",
                        "fullName", "forgex-demo/food-delivery-system",
                        "defaultBranch", "main",
                        "language", "Java",
                        "filesCount", 184,
                        "openIssues", 7,
                        "openPrs", 3,
                        "isPrivate", false
                ),
                Map.of(
                        "name", "smart-parking-iot",
                        "fullName", "forgex-demo/smart-parking-iot",
                        "defaultBranch", "main",
                        "language", "Java",
                        "filesCount", 126,
                        "openIssues", 4,
                        "openPrs", 1,
                        "isPrivate", false
                ),
                Map.of(
                        "name", "college-portal-backend",
                        "fullName", "forgex-demo/college-portal-backend",
                        "defaultBranch", "main",
                        "language", "TypeScript",
                        "filesCount", 95,
                        "openIssues", 2,
                        "openPrs", 0,
                        "isPrivate", true
                )
        );
        return ResponseEntity.ok(repos);
    }

    @GetMapping("/repos/{owner}/{repo}/stats")
    public ResponseEntity<Map<String, Object>> getRepoStats(@PathVariable String owner, @PathVariable String repo) {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("repository", repo);
        stats.put("owner", owner);
        stats.put("defaultBranch", "main");
        stats.put("language", "Java");
        stats.put("framework", "Spring Boot 3");
        stats.put("database", "PostgreSQL");
        stats.put("files", 184);
        stats.put("openIssues", 7);
        stats.put("openPrs", 3);
        stats.put("stars", 142);
        stats.put("forks", 38);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/repos/{owner}/{repo}/branches")
    public ResponseEntity<Map<String, Object>> createBranch(
            @PathVariable String owner,
            @PathVariable String repo,
            @RequestBody Map<String, String> payload
    ) {
        String branchName = payload.getOrDefault("branchName", "feature/new-branch");
        String baseBranch = payload.getOrDefault("baseBranch", "main");
        return ResponseEntity.ok(Map.of(
                "status", "CREATED",
                "branch", branchName,
                "base", baseBranch,
                "commitSha", "a9f82bc3194098234abcf9"
        ));
    }

    @PostMapping("/repos/{owner}/{repo}/issues")
    public ResponseEntity<Map<String, Object>> createIssue(
            @PathVariable String owner,
            @PathVariable String repo,
            @RequestBody Map<String, String> payload
    ) {
        String title = payload.getOrDefault("title", "New Issue");
        String body = payload.getOrDefault("body", "");
        return ResponseEntity.ok(Map.of(
                "issueNumber", 48,
                "title", title,
                "body", body,
                "url", "https://github.com/" + owner + "/" + repo + "/issues/48",
                "status", "OPEN"
        ));
    }

    @PostMapping("/repos/{owner}/{repo}/pulls")
    public ResponseEntity<Map<String, Object>> createPullRequest(
            @PathVariable String owner,
            @PathVariable String repo,
            @RequestBody Map<String, Object> payload
    ) {
        String title = (String) payload.getOrDefault("title", "feat: AI generated verified changes");
        String head = (String) payload.getOrDefault("head", "feature/forgex-ai-gen");
        String base = (String) payload.getOrDefault("base", "main");
        int trustScore = ((Number) payload.getOrDefault("trustScore", 87)).intValue();

        return ResponseEntity.ok(Map.of(
                "prNumber", 52,
                "title", title,
                "head", head,
                "base", base,
                "url", "https://github.com/" + owner + "/" + repo + "/pull/52",
                "trustScoreBadge", "https://img.shields.io/badge/ForgeX%20Trust%20Score-" + trustScore + "%2F100-brightgreen",
                "ciStatus", "RUNNING",
                "status", "OPEN"
        ));
    }
}
