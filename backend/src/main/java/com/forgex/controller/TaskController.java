package com.forgex.controller;

import com.forgex.entity.ProjectEntity;
import com.forgex.entity.TaskEntity;
import com.forgex.entity.User;
import com.forgex.repository.ProjectEntityRepository;
import com.forgex.repository.TaskEntityRepository;
import com.forgex.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskEntityRepository taskRepository;
    private final ProjectEntityRepository projectRepository;
    private final UserRepository userRepository;

    public TaskController(TaskEntityRepository taskRepository, ProjectEntityRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskEntity>> getProjectTasks(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskRepository.findByProject_IdOrderByCreatedAtDesc(projectId));
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> createTask(@PathVariable Long projectId, @RequestBody Map<String, String> payload) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElse(null);
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
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        if (payload.containsKey("title")) task.setTitle(payload.get("title"));
        if (payload.containsKey("description")) task.setDescription(payload.get("description"));
        if (payload.containsKey("priority")) task.setPriority(payload.get("priority").toUpperCase());
        if (payload.containsKey("status")) task.setStatus(payload.get("status").toUpperCase());
        if (payload.containsKey("storyKey")) task.setStoryKey(payload.get("storyKey"));
        if (payload.containsKey("acceptanceCriteria")) task.setAcceptanceCriteria(payload.get("acceptanceCriteria"));

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) return ResponseEntity.notFound().build();
        taskRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully", "id", id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        String newStatus = payload.get("status");
        if (newStatus != null && !newStatus.isBlank()) {
            task.setStatus(newStatus.toUpperCase());
            return ResponseEntity.ok(taskRepository.save(task));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Missing status field"));
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<?> updateTaskPriority(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

        String newPriority = payload.get("priority");
        if (newPriority != null && !newPriority.isBlank()) {
            task.setPriority(newPriority.toUpperCase());
            return ResponseEntity.ok(taskRepository.save(task));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Missing priority field"));
    }

    @PatchMapping("/{id}/assignee")
    public ResponseEntity<?> updateTaskAssignee(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.notFound().build();

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
