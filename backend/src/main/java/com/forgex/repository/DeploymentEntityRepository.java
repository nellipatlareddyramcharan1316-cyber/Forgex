package com.forgex.repository;

import com.forgex.entity.DeploymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeploymentEntityRepository extends JpaRepository<DeploymentEntity, Long> {
    List<DeploymentEntity> findByProject_Id(Long projectId);
}
