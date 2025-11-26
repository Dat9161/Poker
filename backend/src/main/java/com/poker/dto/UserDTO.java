package com.poker.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Long chips;
    private Integer totalGames;
    private Integer wins;
    private Integer losses;
    private Double winRate;
}
