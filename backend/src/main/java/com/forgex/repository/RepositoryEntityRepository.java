package com.forgex.repository;

import com.forgex.entity.RepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositoryEntityRepository extends JpaRepository<RepositoryEntity, Long> {
    List<RepositoryEntity> findByProject_Id(Long projectId);
}
