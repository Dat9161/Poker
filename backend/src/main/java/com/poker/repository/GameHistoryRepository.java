package com.poker.repository;

import com.poker.model.GameHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameHistoryRepository extends JpaRepository<GameHistory, Long> {
    List<GameHistory> findByRoomIdOrderByPlayedAtDesc(Long roomId);
    List<GameHistory> findTop10ByOrderByPlayedAtDesc();
}
