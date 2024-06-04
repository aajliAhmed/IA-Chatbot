package com.automechanic.ai.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleMechanicalInfoDto {
    private Long id;
    private Long carModelId;
    private String modelName;
    private String brandName;
    private String engineType;
    private String oilCapacity;
    private String oilType;
    private String horsepower;
    private String fuelType;
    private String transmission;
    private String tirePressure;
    private String recommendedBattery;
    private String averageConsumption;
    private String maintenanceFrequency;
    private String commonProblems;
    private String sensitiveParts;
}
