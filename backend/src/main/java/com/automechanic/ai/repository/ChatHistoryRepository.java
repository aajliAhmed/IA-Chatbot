package com.automechanic.ai.repository;

import com.automechanic.ai.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByCarModelIdOrderByTimestampAsc(Long carModelId);
    List<ChatHistory> findByUsernameOrderByTimestampAsc(String username);
}
