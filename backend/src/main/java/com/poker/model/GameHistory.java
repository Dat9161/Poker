package com.poker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_history")
@Data
public class GameHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "room_id", nullable = false)
    private Long roomId;
    
    @Column(name = "winner_id")
    private Long winnerId;
    
    @Column(name = "pot_amount", nullable = false)
    private Long potAmount;
    
    @Column(name = "winning_hand", length = 50)
    private String winningHand;
    
    @Column(name = "players_count", nullable = false)
    private Integer playersCount;
    
    @Column(name = "played_at")
    private LocalDateTime playedAt = LocalDateTime.now();
}
