package com.automechanic.ai.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {
    private String probableDiagnostic;
    private String possibleCause;
    private String urgencyLevel; // FAIBLE, MOYEN, ÉLEVÉ
    private String checkAdvice;
    private String concernedParts;
    private String maintenanceRecommendation;
    private String replyText; // Combined answer text
    private LocalDateTime timestamp;
}
