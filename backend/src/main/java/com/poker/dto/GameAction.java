package com.poker.dto;

import lombok.Data;

@Data
public class GameAction {
    private Long userId;
    private String action;
    private Long amount;
}
