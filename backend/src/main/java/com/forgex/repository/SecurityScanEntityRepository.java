package com.forgex.repository;

import com.forgex.entity.SecurityScanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityScanEntityRepository extends JpaRepository<SecurityScanEntity, Long> {
    List<SecurityScanEntity> findByProject_Id(Long projectId);
    long countByIsBlocked(Boolean isBlocked);
}
