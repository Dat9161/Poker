package com.poker.service;

import com.poker.dto.GameAction;
import com.poker.dto.GameState;
import com.poker.model.GameHistory;
import com.poker.repository.GameHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GameService {
    
    private final GameHistoryRepository gameHistoryRepository;
    private final Map<Long, GameState> activeGames = new HashMap<>();
    
    public GameState joinGame(Long roomId, Long userId) {
        GameState game = activeGames.computeIfAbsent(roomId, k -> new GameState(roomId));
        game.addPlayer(userId);
        
        if (game.getPlayers().size() >= 2 && !game.isStarted()) {
            startGame(game);
        }
        
        return game;
    }
    
    public GameState processAction(Long roomId, GameAction action) {
        GameState game = activeGames.get(roomId);
        if (game == null) {
            throw new RuntimeException("Game not found");
        }
        
        switch (action.getAction().toUpperCase()) {
            case "FOLD":
                game.fold(action.getUserId());
                break;
            case "CHECK":
                game.check(action.getUserId());
                break;
            case "CALL":
                game.call(action.getUserId());
                break;
            case "RAISE":
                game.raise(action.getUserId(), action.getAmount());
                break;
        }
        
        if (game.isRoundComplete()) {
            game.nextRound();
        }
        
        if (game.isGameComplete()) {
            endGame(game);
        }
        
        return game;
    }
    
    private void startGame(GameState game) {
        game.start();
        game.dealCards();
    }
    
    private void endGame(GameState game) {
        GameHistory history = new GameHistory();
        history.setRoomId(game.getRoomId());
        history.setWinnerId(game.getWinnerId());
        history.setPotAmount(game.getPot());
        history.setPlayersCount(game.getPlayers().size());
        gameHistoryRepository.save(history);
        
        activeGames.remove(game.getRoomId());
    }
}
