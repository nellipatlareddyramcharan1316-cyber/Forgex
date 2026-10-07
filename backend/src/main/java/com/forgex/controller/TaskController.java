package com.forgex.controller;

import com.forgex.entity.ProjectEntity;
import com.forgex.entity.TaskEntity;
import com.forgex.repository.ProjectEntityRepository;
import com.forgex.repository.TaskEntityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskEntityRepository taskRepository;
    private final ProjectEntityRepository projectRepository;

    public TaskController(TaskEntityRepository taskRepository, ProjectEntityRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
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
        TaskEntity saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        TaskEntity task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = payload.get("status");
        if (newStatus != null && !newStatus.isBlank()) {
            task.setStatus(newStatus.toUpperCase());
            TaskEntity updated = taskRepository.save(task);
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Missing status field"));
    }
}
