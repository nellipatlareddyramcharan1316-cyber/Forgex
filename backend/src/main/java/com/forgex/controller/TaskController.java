package com.forgex.controller;

import com.forgex.model.Task;
import com.forgex.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final ProjectService projectService;

    public TaskController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getProjectTasks(@PathVariable String projectId) {
        return ResponseEntity.ok(projectService.getTasksForProject(projectId));
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<Task> createTask(@PathVariable String projectId, @RequestBody Task task) {
        Task created = projectService.addTask(projectId, task);
        return ResponseEntity.ok(created);
    }
}
