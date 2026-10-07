package com.forgex.repository;

import com.forgex.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectEntityRepository extends JpaRepository<ProjectEntity, Long> {
    List<ProjectEntity> findAllByOrderByCreatedAtDesc();
}
