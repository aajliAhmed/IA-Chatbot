package com.automechanic.ai.controller;

import com.automechanic.ai.dto.ChatRequest;
import com.automechanic.ai.dto.ChatResponse;
import com.automechanic.ai.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> processChatMessage(@Valid @RequestBody ChatRequest chatRequest) {
        return ResponseEntity.ok(chatService.processUserMessage(chatRequest));
    }
}
