package com.forgex.repository;

import com.forgex.entity.TrustScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrustScoreEntityRepository extends JpaRepository<TrustScoreEntity, Long> {

    Optional<TrustScoreEntity> findTopByTaskKeyOrderByCalculatedAtDesc(String taskKey);

    List<TrustScoreEntity> findByTaskKeyOrderByCalculatedAtDesc(String taskKey);

    List<TrustScoreEntity> findAllByOrderByCalculatedAtDesc();
}
