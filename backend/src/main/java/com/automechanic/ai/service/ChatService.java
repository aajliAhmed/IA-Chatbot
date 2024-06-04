package com.automechanic.ai.service;

import com.automechanic.ai.dto.ChatRequest;
import com.automechanic.ai.dto.ChatResponse;
import com.automechanic.ai.entity.CarModel;
import com.automechanic.ai.entity.ChatHistory;
import com.automechanic.ai.repository.CarModelRepository;
import com.automechanic.ai.repository.ChatHistoryRepository;
import com.automechanic.ai.service.llm.LlmProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatService {

    private final CarModelRepository carModelRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final LlmProvider llmProvider; // Injecting the polymorphic interface

    public ChatResponse processUserMessage(ChatRequest chatRequest) {
        Long modelId = chatRequest.getModelId();
        String userMessage = chatRequest.getMessage();

        // 1. Fetch vehicle model details
        CarModel carModel = carModelRepository.findById(modelId)
                .orElseThrow(() -> new IllegalArgumentException("Car model not found with ID: " + modelId));

        String brandName = carModel.getBrand().getName();
        String modelName = carModel.getName();

        // 2. Generate response using active LLM provider (mocked rule-based with fallback support)
        ChatResponse chatResponse = llmProvider.generateResponse(brandName, modelName, userMessage);

        // 3. Extract logged-in username if present (from JWT filter context)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            currentUsername = authentication.getName();
        }

        // 4. Save to database history only if it's on-topic mechanical diagnostic dialogue
        if (!"Hors sujet".equals(chatResponse.getProbableDiagnostic())) {
            ChatHistory history = ChatHistory.builder()
                    .carModel(carModel)
                    .userMessage(userMessage)
                    .aiResponse(chatResponse.getReplyText())
                    .username(currentUsername)
                    .build();
            chatHistoryRepository.save(history);
            log.info("Persisted mechanical chat session for model {} under user {}", modelName, currentUsername);
        }

        return chatResponse;
    }
}
