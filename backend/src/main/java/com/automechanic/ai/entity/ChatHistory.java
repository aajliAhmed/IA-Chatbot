package com.automechanic.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_model_id", nullable = false)
    private CarModel carModel;

    @Column(name = "user_message", length = 1000, nullable = false)
    private String userMessage;

    @Column(name = "ai_response", length = 2000, nullable = false)
    private String aiResponse;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "username")
    private String username;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
