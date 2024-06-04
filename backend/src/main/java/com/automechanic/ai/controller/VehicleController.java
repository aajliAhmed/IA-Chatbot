package com.automechanic.ai.controller;

import com.automechanic.ai.dto.VehicleMechanicalInfoDto;
import com.automechanic.ai.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicle")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/{id}/mechanical-data")
    public ResponseEntity<VehicleMechanicalInfoDto> getMechanicalData(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getMechanicalInfoByModelId(id));
    }
}
