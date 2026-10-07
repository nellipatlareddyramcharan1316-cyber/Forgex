package com.forgex.repository;

import com.forgex.entity.TestResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultEntityRepository extends JpaRepository<TestResultEntity, Long> {
    List<TestResultEntity> findByTask_Id(Long taskId);
}
