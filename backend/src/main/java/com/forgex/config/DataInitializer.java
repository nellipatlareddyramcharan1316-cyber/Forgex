package com.forgex.config;

import com.forgex.entity.*;
import com.forgex.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectEntityRepository projectRepository;
    private final EpicEntityRepository epicRepository;
    private final TaskEntityRepository taskRepository;
    private final RepositoryEntityRepository repositoryEntityRepository;
    private final PullRequestEntityRepository pullRequestRepository;
    private final TestResultEntityRepository testResultRepository;
    private final SecurityScanEntityRepository securityScanRepository;
    private final DeploymentEntityRepository deploymentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            ProjectEntityRepository projectRepository,
            EpicEntityRepository epicRepository,
            TaskEntityRepository taskRepository,
            RepositoryEntityRepository repositoryEntityRepository,
            PullRequestEntityRepository pullRequestRepository,
            TestResultEntityRepository testResultRepository,
            SecurityScanEntityRepository securityScanRepository,
            DeploymentEntityRepository deploymentRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.epicRepository = epicRepository;
        this.taskRepository = taskRepository;
        this.repositoryEntityRepository = repositoryEntityRepository;
        this.pullRequestRepository = pullRequestRepository;
        this.testResultRepository = testResultRepository;
        this.securityScanRepository = securityScanRepository;
        this.deploymentRepository = deploymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // 1. Seed Users with BCrypt encrypted passwords
        User admin = userRepository.save(new User("Alice Vance", "admin@forgex.io", passwordEncoder.encode("Password123!"), Role.ROLE_ADMIN));
        User pm = userRepository.save(new User("Marcus Brody", "pm@forgex.io", passwordEncoder.encode("Password123!"), Role.ROLE_PROJECT_MANAGER));
        User dev = userRepository.save(new User("Devon Lee", "dev@forgex.io", passwordEncoder.encode("Password123!"), Role.ROLE_DEVELOPER));
        User viewer = userRepository.save(new User("Sara Connor", "viewer@forgex.io", passwordEncoder.encode("Password123!"), Role.ROLE_VIEWER));

        // 2. Seed Projects
        ProjectEntity foodDelivery = projectRepository.save(new ProjectEntity(
                "Food Delivery Platform",
                "High-throughput food ordering engine with restaurant catalog, cart checkout, and Stripe integration.",
                "https://github.com/forgex-demo/foodieflow",
                dev
        ));

        ProjectEntity parkingSystem = projectRepository.save(new ProjectEntity(
                "Parking System",
                "IoT-integrated automated parking bay reservation system with concurrency control.",
                "https://github.com/forgex-demo/smartpark",
                pm
        ));

        ProjectEntity collegePortal = projectRepository.save(new ProjectEntity(
                "College Portal",
                "Integrated academic management system with grades, attendance, and fee tracking.",
                "https://github.com/forgex-demo/collegeportal",
                admin
        ));
        collegePortal.setStatus("DEVELOPMENT");
        projectRepository.save(collegePortal);

        // 3. Seed Epics
        EpicEntity epicAuth = epicRepository.save(new EpicEntity(foodDelivery, "EPIC-1", "User Authentication", "JWT login and RBAC permissions"));
        EpicEntity epicCatalog = epicRepository.save(new EpicEntity(foodDelivery, "EPIC-2", "Restaurant Catalog", "Geo-radius spatial restaurant lookup"));
        EpicEntity epicPayment = epicRepository.save(new EpicEntity(foodDelivery, "EPIC-3", "Stripe Payments", "Idempotent payment transactions and webhook handlers"));

        // 4. Seed Tasks
        TaskEntity t1 = taskRepository.save(new TaskEntity(foodDelivery, epicAuth, "US-101", "Customer JWT Authentication", "Implement BCrypt password hashing and token generation", "DONE", "HIGH"));
        t1.setAssignee(dev);
        taskRepository.save(t1);

        TaskEntity t2 = taskRepository.save(new TaskEntity(foodDelivery, epicAuth, "US-102", "Role-Based Access Control", "Enforce RBAC annotations on admin and restaurant routes", "IN_REVIEW", "MEDIUM"));
        t2.setAssignee(dev);
        taskRepository.save(t2);

        TaskEntity t3 = taskRepository.save(new TaskEntity(foodDelivery, epicCatalog, "US-103", "Geo-Radius Menu Search", "Query open restaurants within 5km radius with Redis cache", "IN_PROGRESS", "HIGH"));
        t3.setAssignee(dev);
        taskRepository.save(t3);

        TaskEntity t4 = taskRepository.save(new TaskEntity(foodDelivery, epicPayment, "US-104", "Idempotent Payment Intent API", "Stripe checkout with Idempotency-Key validation", "BACKLOG", "CRITICAL"));
        t4.setAssignee(dev);
        taskRepository.save(t4);

        // 5. Seed Repository & Pull Requests
        repositoryEntityRepository.save(new RepositoryEntity(foodDelivery, "https://github.com/forgex-demo/foodieflow", "main", "Java / Spring Boot"));
        pullRequestRepository.save(new PullRequestEntity(foodDelivery, t1, 41, "feat(auth): JWT authentication and password hashing", "feature/auth-jwt", 95));
        pullRequestRepository.save(new PullRequestEntity(foodDelivery, t4, 42, "feat(payment): Idempotent payment intent with verified tests", "feature/payment-stripe", 87));

        // 6. Seed Tests & Security Scans
        testResultRepository.save(new TestResultEntity(t1, 24, 24, "UNIT", 94.5));
        testResultRepository.save(new TestResultEntity(t4, 18, 18, "UNIT", 91.0));

        securityScanRepository.save(new SecurityScanEntity(foodDelivery, "INFO", "SAST", "Clean Static Analysis", "No critical SQL injection or XSS patterns detected", false));
        securityScanRepository.save(new SecurityScanEntity(foodDelivery, "MEDIUM", "VULN_DEPENDENCY", "Transitive Dependency Notice", "jackson-databind patch available", false));

        // 7. Seed Deployment
        deploymentRepository.save(new DeploymentEntity(foodDelivery, "PRODUCTION", "v1.2.0", "HEALTHY", 182.0));
    }
}
