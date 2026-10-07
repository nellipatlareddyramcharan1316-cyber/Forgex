package com.forgex.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "test_results")
public class TestResultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private TaskEntity task;

    @Column(nullable = false)
    private Integer passed = 0;

    @Column(nullable = false)
    private Integer total = 0;

    @Column(name = "test_type", length = 64)
    private String testType = "UNIT"; // UNIT, INTEGRATION, REGRESSION

    @Column(name = "coverage_pct")
    private Double coveragePct = 91.0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public TestResultEntity() {}

    public TestResultEntity(TaskEntity task, Integer passed, Integer total, String testType, Double coveragePct) {
        this.task = task;
        this.passed = passed;
        this.total = total;
        this.testType = testType;
        this.coveragePct = coveragePct;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TaskEntity getTask() { return task; }
    public void setTask(TaskEntity task) { this.task = task; }

    public Integer getPassed() { return passed; }
    public void setPassed(Integer passed) { this.passed = passed; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public Double getCoveragePct() { return coveragePct; }
    public void setCoveragePct(Double coveragePct) { this.coveragePct = coveragePct; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
