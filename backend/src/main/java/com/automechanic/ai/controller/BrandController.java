package com.automechanic.ai.controller;

import com.automechanic.ai.dto.BrandDto;
import com.automechanic.ai.dto.CarModelDto;
import com.automechanic.ai.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class BrandController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<BrandDto>> getAllBrands() {
        return ResponseEntity.ok(vehicleService.getAllBrands());
    }

    @GetMapping("/{id}/models")
    public ResponseEntity<List<CarModelDto>> getModelsByBrand(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getModelsByBrand(id));
    }
}
