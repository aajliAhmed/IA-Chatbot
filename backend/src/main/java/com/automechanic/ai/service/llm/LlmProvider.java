package com.automechanic.ai.service.llm;

import com.automechanic.ai.dto.ChatResponse;

public interface LlmProvider {
    ChatResponse generateResponse(String brandName, String carModelName, String userMessage);
}
