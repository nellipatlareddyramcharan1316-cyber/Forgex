package com.forgex.repository;

import com.forgex.entity.EpicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpicEntityRepository extends JpaRepository<EpicEntity, Long> {
    List<EpicEntity> findByProject_Id(Long projectId);
}
