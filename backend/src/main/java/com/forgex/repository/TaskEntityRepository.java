package com.forgex.repository;

import com.forgex.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskEntityRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findByProject_Id(Long projectId);
    List<TaskEntity> findByProject_IdOrderByCreatedAtDesc(Long projectId);
    long countByStatus(String status);
}
