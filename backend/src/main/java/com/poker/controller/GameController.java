package com.poker.controller;

import com.poker.dto.GameAction;
import com.poker.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class GameController {
    
    private final GameService gameService;
    
    @MessageMapping("/game/{roomId}/action")
    @SendTo("/topic/game/{roomId}")
    public Object handleGameAction(@DestinationVariable Long roomId, GameAction action) {
        return gameService.processAction(roomId, action);
    }
    
    @MessageMapping("/game/{roomId}/join")
    @SendTo("/topic/game/{roomId}")
    public Object joinGame(@DestinationVariable Long roomId, Long userId) {
        return gameService.joinGame(roomId, userId);
    }
}
