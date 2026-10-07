package com.forgex.controller;

import com.forgex.entity.ProjectEntity;
import com.forgex.entity.User;
import com.forgex.repository.ProjectEntityRepository;
import com.forgex.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectEntityRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectController(ProjectEntityRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProjectEntity>> listProjects() {
        return ResponseEntity.ok(projectRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectEntity> getProject(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProjectEntity> createProject(@RequestBody Map<String, String> payload, Authentication auth) {
        String name = payload.getOrDefault("name", "New Project");
        String description = payload.getOrDefault("description", "");
        String repoUrl = payload.getOrDefault("repositoryUrl", "https://github.com/forgex-demo/" + name.toLowerCase().replaceAll("\\s+", "-"));

        User owner = null;
        if (auth != null && auth.isAuthenticated()) {
            owner = userRepository.findByEmail(auth.getName()).orElse(null);
        }
        if (owner == null) {
            owner = userRepository.findAll().stream().findFirst().orElse(null);
        }

        ProjectEntity project = new ProjectEntity(name, description, repoUrl, owner);
        ProjectEntity saved = projectRepository.save(project);
        return ResponseEntity.ok(saved);
    }
}
