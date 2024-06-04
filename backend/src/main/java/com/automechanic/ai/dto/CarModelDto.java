package com.automechanic.ai.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarModelDto {
    private Long id;
    private String name;
    private Long brandId;
}
