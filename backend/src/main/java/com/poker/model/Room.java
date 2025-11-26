package com.poker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(name = "max_players")
    private Integer maxPlayers = 6;
    
    @Column(name = "small_blind")
    private Long smallBlind = 10L;
    
    @Column(name = "big_blind")
    private Long bigBlind = 20L;
    
    @Column(length = 20)
    private String status = "WAITING";
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
