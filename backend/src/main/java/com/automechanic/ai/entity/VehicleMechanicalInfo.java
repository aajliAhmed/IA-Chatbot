package com.automechanic.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "vehicle_mechanical_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleMechanicalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_model_id", nullable = false, unique = true)
    @JsonBackReference
    private CarModel carModel;

    @Column(name = "engine_type")
    private String engineType;

    @Column(name = "oil_capacity")
    private String oilCapacity;

    @Column(name = "oil_type")
    private String oilType;

    @Column(name = "horsepower")
    private String horsepower;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "transmission")
    private String transmission;

    @Column(name = "tire_pressure")
    private String tirePressure;

    @Column(name = "recommended_battery")
    private String recommendedBattery;

    @Column(name = "average_consumption")
    private String averageConsumption;

    @Column(name = "maintenance_frequency")
    private String maintenanceFrequency;

    @Column(name = "common_problems", length = 1000)
    private String commonProblems;

    @Column(name = "sensitive_parts", length = 1000)
    private String sensitiveParts;
}
