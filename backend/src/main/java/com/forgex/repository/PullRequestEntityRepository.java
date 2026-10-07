package com.forgex.repository;

import com.forgex.entity.PullRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PullRequestEntityRepository extends JpaRepository<PullRequestEntity, Long> {
    List<PullRequestEntity> findByProject_Id(Long projectId);
    long countByStatus(String status);
}
