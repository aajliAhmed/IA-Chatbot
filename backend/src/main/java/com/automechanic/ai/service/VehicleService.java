package com.automechanic.ai.service;

import com.automechanic.ai.dto.*;
import com.automechanic.ai.entity.*;
import com.automechanic.ai.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VehicleService {

    private final BrandRepository brandRepository;
    private final CarModelRepository carModelRepository;
    private final VehicleMechanicalInfoRepository mechanicalInfoRepository;

    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(brand -> BrandDto.builder()
                        .id(brand.getId())
                        .name(brand.getName())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CarModelDto> getModelsByBrand(Long brandId) {
        return carModelRepository.findByBrandId(brandId).stream()
                .map(model -> CarModelDto.builder()
                        .id(model.getId())
                        .name(model.getName())
                        .brandId(model.getBrand().getId())
                        .build())
                .collect(Collectors.toList());
    }

    public VehicleMechanicalInfoDto getMechanicalInfoByModelId(Long modelId) {
        VehicleMechanicalInfo info = mechanicalInfoRepository.findByCarModelId(modelId)
                .orElseThrow(() -> new IllegalArgumentException("Mechanical specifications not found for model ID: " + modelId));

        return VehicleMechanicalInfoDto.builder()
                .id(info.getId())
                .carModelId(info.getCarModel().getId())
                .modelName(info.getCarModel().getName())
                .brandName(info.getCarModel().getBrand().getName())
                .engineType(info.getEngineType())
                .oilCapacity(info.getOilCapacity())
                .oilType(info.getOilType())
                .horsepower(info.getHorsepower())
                .fuelType(info.getFuelType())
                .transmission(info.getTransmission())
                .tirePressure(info.getTirePressure())
                .recommendedBattery(info.getRecommendedBattery())
                .averageConsumption(info.getAverageConsumption())
                .maintenanceFrequency(info.getMaintenanceFrequency())
                .commonProblems(info.getCommonProblems())
                .sensitiveParts(info.getSensitiveParts())
                .build();
    }
}
