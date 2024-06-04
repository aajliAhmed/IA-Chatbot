package com.automechanic.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequest {
    @NotNull(message = "Vehicle model ID is required")
    private Long modelId;

    @NotBlank(message = "Message cannot be blank")
    private String message;
}
