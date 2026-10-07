package com.forgex.controller;

import com.forgex.entity.*;
import com.forgex.repository.*;
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
    private final ProjectMemberRepository memberRepository;
    private final RequirementEntityRepository requirementRepository;
    private final EpicEntityRepository epicRepository;

    public ProjectController(
            ProjectEntityRepository projectRepository,
            UserRepository userRepository,
            ProjectMemberRepository memberRepository,
            RequirementEntityRepository requirementRepository,
            EpicEntityRepository epicRepository
    ) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
        this.requirementRepository = requirementRepository;
        this.epicRepository = epicRepository;
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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        ProjectEntity project = projectRepository.findById(id).orElse(null);
        if (project == null) return ResponseEntity.notFound().build();

        if (payload.containsKey("name")) project.setName(payload.get("name"));
        if (payload.containsKey("description")) project.setDescription(payload.get("description"));
        if (payload.containsKey("repositoryUrl")) project.setRepositoryUrl(payload.get("repositoryUrl"));
        if (payload.containsKey("status")) project.setStatus(payload.get("status"));

        return ResponseEntity.ok(projectRepository.save(project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) return ResponseEntity.notFound().build();
        projectRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully", "id", id));
    }

    // Members
    @GetMapping("/{id}/members")
    public ResponseEntity<List<ProjectMember>> getProjectMembers(@PathVariable Long id) {
        return ResponseEntity.ok(memberRepository.findByProject_Id(id));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addProjectMember(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        ProjectEntity project = projectRepository.findById(id).orElse(null);
        if (project == null) return ResponseEntity.notFound().build();

        String email = payload.get("email");
        String roleStr = payload.getOrDefault("role", "DEVELOPER");
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found with email: " + email));
        }

        ProjectMember member = new ProjectMember(project, user, Role.fromString(roleStr));
        return ResponseEntity.ok(memberRepository.save(member));
    }

    // Requirements
    @GetMapping("/{id}/requirements")
    public ResponseEntity<List<RequirementEntity>> getProjectRequirements(@PathVariable Long id) {
        return ResponseEntity.ok(requirementRepository.findByProject_Id(id));
    }

    @PostMapping("/{id}/requirements")
    public ResponseEntity<?> createRequirement(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        ProjectEntity project = projectRepository.findById(id).orElse(null);
        if (project == null) return ResponseEntity.notFound().build();

        String prompt = payload.getOrDefault("rawPrompt", "");
        String summary = payload.getOrDefault("architectureSummary", "Architectural decomposition pending");
        RequirementEntity req = new RequirementEntity(project, prompt, summary);
        return ResponseEntity.ok(requirementRepository.save(req));
    }

    // Epics
    @GetMapping("/{id}/epics")
    public ResponseEntity<List<EpicEntity>> getProjectEpics(@PathVariable Long id) {
        return ResponseEntity.ok(epicRepository.findByProject_Id(id));
    }

    @PostMapping("/{id}/epics")
    public ResponseEntity<?> createEpic(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        ProjectEntity project = projectRepository.findById(id).orElse(null);
        if (project == null) return ResponseEntity.notFound().build();

        String key = payload.getOrDefault("epicKey", "EPIC-" + (epicRepository.count() + 1));
        String name = payload.getOrDefault("name", "New Epic");
        String desc = payload.getOrDefault("description", "");
        EpicEntity epic = new EpicEntity(project, key, name, desc);
        return ResponseEntity.ok(epicRepository.save(epic));
    }
}
