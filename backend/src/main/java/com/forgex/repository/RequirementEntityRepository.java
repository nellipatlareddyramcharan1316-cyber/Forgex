package com.forgex.repository;

import com.forgex.entity.RequirementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequirementEntityRepository extends JpaRepository<RequirementEntity, Long> {
    List<RequirementEntity> findByProject_Id(Long projectId);
}
