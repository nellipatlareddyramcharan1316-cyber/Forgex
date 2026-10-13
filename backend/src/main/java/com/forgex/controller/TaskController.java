package com.forgex.controller;

import com.forgex.entity.ProjectEntity;
import com.forgex.entity.TaskEntity;
import com.forgex.entity.User;
import com.forgex.repository.ProjectEntityRepository;
import com.forgex.repository.TaskEntityRepository;
import com.forgex.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import com.forgex.entity.Role;
import com.forgex.repository.ProjectMemberRepository;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskEntityRepository taskRepository;
    private final ProjectEntityRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository memberRepository;

    public TaskController(
            TaskEntityRepository taskRepository,
            ProjectEntityRepository projectRepository,
            UserRepository userRepository,
            ProjectMemberRepository memberRepository
    ) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
    }

    private boolean hasAccessToProject(Long projectId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;
        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        if (currentUser == null) return false;
        if (currentUser.getRole() == Role.ROLE_ADMIN) return true;

        ProjectEntity project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return false;
        if (project.getOwner() != null && project.getOwner().getEmail().equalsIgnoreCase(email)) return true;

        return memberRepository.findByProject_Id(projectId).stream()
                .anyMatch(m -> m.getUser().getEmail().equalsIgnoreCase(email));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getProjectTasks(@PathVariable @NonNull Long projectId, Authentication auth) {
        if (!hasAccessToProject(projectId, auth)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: you do not have permission to view tasks for this project"));
        }
        return ResponseEntity.ok(taskRepository.findByProject_IdOrderByCreatedAtDesc(projectId));
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> createTask(@PathVariable @NonNull Long projectId, @RequestBody Map<String, String> payload, Authentication auth) {
        if (!hasAccessToProject(projectId, auth)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: you do not have permission to create tasks in this project"));
        }

        ProjectEntity project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Project not found with ID: " + projectId));
        }

        String title = payload.getOrDefault("title", "Untitled Task");
        String description = payload.getOrDefault("description", "");
        String storyKey = payload.getOrDefault("storyKey", "TASK-" + (taskRepository.count() + 101));
        String priority = payload.getOrDefault("priority", "MEDIUM");
        String status = payload.getOrDefault("status", "BACKLOG");

        TaskEntity task = new TaskEntity(project, null, storyKey, title, description, status, priority);
        if (payload.containsKey("acceptanceCriteria")) {
            task.setAcceptanceCriteria(payload.get("acceptanceCriteria"));
        }
        if (payload.containsKey("assigneeEmail")) {
            userRepository.findByEmail(payload.get("assigneeEmail")).ifPresent(task::setAssignee);
        }

        TaskEntity saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable @NonNull Long id, @RequestBody Map<String, String> payload, Authentication auth) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        if (task.getProject() != null && !hasAccessToProject(task.getProject().getId(), auth)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: you do not have permission to modify tasks in this project"));
        }

        if (payload.containsKey("title")) task.setTitle(payload.get("title"));
        if (payload.containsKey("description")) task.setDescription(payload.get("description"));
        if (payload.containsKey("priority")) task.setPriority(payload.get("priority").toUpperCase());
        if (payload.containsKey("status")) task.setStatus(payload.get("status").toUpperCase());
        if (payload.containsKey("storyKey")) task.setStoryKey(payload.get("storyKey"));
        if (payload.containsKey("acceptanceCriteria")) task.setAcceptanceCriteria(payload.get("acceptanceCriteria"));

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable @NonNull Long id, Authentication auth) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        if (task.getProject() != null && !hasAccessToProject(task.getProject().getId(), auth)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: you do not have permission to delete tasks in this project"));
        }

        taskRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully", "id", id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable @NonNull Long id, @RequestBody Map<String, String> payload, Authentication auth) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        if (task.getProject() != null && !hasAccessToProject(task.getProject().getId(), auth)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: you do not have permission to update tasks in this project"));
        }

        String newStatus = payload.get("status");
        if (newStatus != null && !newStatus.isBlank()) {
            task.setStatus(newStatus.toUpperCase());
            return ResponseEntity.ok(taskRepository.save(task));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Missing status field"));
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<?> updateTaskPriority(@PathVariable @NonNull Long id, @RequestBody Map<String, String> payload, Authentication auth) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        if (task.getProject() != null && !hasAccessToProject(task.getProject().getId(), auth)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: you do not have permission to update tasks in this project"));
        }

        String newPriority = payload.get("priority");
        if (newPriority != null && !newPriority.isBlank()) {
            task.setPriority(newPriority.toUpperCase());
            return ResponseEntity.ok(taskRepository.save(task));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Missing priority field"));
    }

    @PatchMapping("/{id}/assignee")
    public ResponseEntity<?> updateTaskAssignee(@PathVariable @NonNull Long id, @RequestBody Map<String, String> payload, Authentication auth) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        if (task.getProject() != null && !hasAccessToProject(task.getProject().getId(), auth)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: you do not have permission to assign tasks in this project"));
        }

        String email = payload.get("email");
        if (email != null && !email.isBlank()) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found with email: " + email));
            }
            task.setAssignee(user);
        } else {
            task.setAssignee(null);
        }

        return ResponseEntity.ok(taskRepository.save(task));
    }
}
