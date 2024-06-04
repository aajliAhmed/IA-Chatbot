package com.automechanic.ai.repository;

import com.automechanic.ai.entity.VehicleMechanicalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VehicleMechanicalInfoRepository extends JpaRepository<VehicleMechanicalInfo, Long> {
    Optional<VehicleMechanicalInfo> findByCarModelId(Long carModelId);
}
