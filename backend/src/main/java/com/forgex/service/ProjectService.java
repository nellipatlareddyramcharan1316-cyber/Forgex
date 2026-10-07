package com.forgex.service;

import com.forgex.model.Project;
import com.forgex.model.Task;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ProjectService {

    private final Map<String, Project> projects = new ConcurrentHashMap<>();
    private final Map<String, List<Task>> projectTasks = new ConcurrentHashMap<>();

    public ProjectService() {
        // Seed default showcase project
        Project defaultProject = new Project(
                "proj-foodie-01",
                "FoodieFlow — Cloud Food Delivery",
                "Hyper-local food ordering, automated menu search, cart checkout, and Stripe payments.",
                "https://github.com/forgex-demo/foodieflow"
        );
        projects.put(defaultProject.getId(), defaultProject);

        List<Task> defaultTaskList = new ArrayList<>();
        defaultTaskList.add(new Task(
                "task-1",
                defaultProject.getId(),
                "US-101",
                "EPIC-1: Authentication",
                "Customer JWT Authentication",
                "Implement secure token issuance and BCrypt password encryption",
                List.of("JWT access token expires in 15m", "Reject invalid credentials with HTTP 401")
        ));
        defaultTaskList.add(new Task(
                "task-2",
                defaultProject.getId(),
                "US-104",
                "EPIC-3: Payments",
                "Idempotent Payment Intent API",
                "Stripe integration with unique idempotency key locks",
                List.of("Verify header Idempotency-Key", "Pessimistic DB lock on order state")
        ));
        projectTasks.put(defaultProject.getId(), defaultTaskList);
    }

    public List<Project> getAllProjects() {
        return new ArrayList<>(projects.values());
    }

    public Optional<Project> getProjectById(String id) {
        return Optional.ofNullable(projects.get(id));
    }

    public Project createProject(Project project) {
        if (project.getId() == null || project.getId().isBlank()) {
            project.setId("proj-" + UUID.randomUUID().toString().substring(0, 8));
        }
        projects.put(project.getId(), project);
        projectTasks.putIfAbsent(project.getId(), new ArrayList<>());
        return project;
    }

    public List<Task> getTasksForProject(String projectId) {
        return projectTasks.getOrDefault(projectId, Collections.emptyList());
    }

    public Task addTask(String projectId, Task task) {
        if (task.getId() == null || task.getId().isBlank()) {
            task.setId("task-" + UUID.randomUUID().toString().substring(0, 8));
        }
        task.setProjectId(projectId);
        projectTasks.computeIfAbsent(projectId, k -> new ArrayList<>()).add(task);
        return task;
    }
}
