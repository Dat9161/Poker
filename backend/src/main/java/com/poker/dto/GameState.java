package com.poker.dto;

import lombok.Data;
import java.util.*;

@Data
public class GameState {
    private Long roomId;
    private List<Long> players = new ArrayList<>();
    private Map<Long, List<String>> playerCards = new HashMap<>();
    private List<String> communityCards = new ArrayList<>();
    private Map<Long, Long> playerChips = new HashMap<>();
    private Map<Long, Long> playerBets = new HashMap<>();
    private Long pot = 0L;
    private Long currentBet = 0L;
    private int currentPlayerIndex = 0;
    private String phase = "WAITING";
    private boolean started = false;
    private Long winnerId;
    
    public GameState(Long roomId) {
        this.roomId = roomId;
    }
    
    public void addPlayer(Long userId) {
        if (!players.contains(userId)) {
            players.add(userId);
            playerChips.put(userId, 1000L);
            playerBets.put(userId, 0L);
        }
    }
    
    public void start() {
        this.started = true;
        this.phase = "PRE_FLOP";
    }
    
    public void dealCards() {
        List<String> deck = createDeck();
        Collections.shuffle(deck);
        
        for (Long playerId : players) {
            List<String> cards = Arrays.asList(deck.remove(0), deck.remove(0));
            playerCards.put(playerId, cards);
        }
    }
    
    public void fold(Long userId) {
        players.remove(userId);
    }
    
    public void check(Long userId) {
        nextPlayer();
    }
    
    public void call(Long userId) {
        Long callAmount = currentBet - playerBets.get(userId);
        playerBets.put(userId, currentBet);
        playerChips.put(userId, playerChips.get(userId) - callAmount);
        pot += callAmount;
        nextPlayer();
    }
    
    public void raise(Long userId, Long amount) {
        Long totalBet = currentBet + amount;
        Long raiseAmount = totalBet - playerBets.get(userId);
        playerBets.put(userId, totalBet);
        playerChips.put(userId, playerChips.get(userId) - raiseAmount);
        pot += raiseAmount;
        currentBet = totalBet;
        nextPlayer();
    }
    
    public boolean isRoundComplete() {
        return playerBets.values().stream().allMatch(bet -> bet.equals(currentBet));
    }
    
    public void nextRound() {
        List<String> deck = createDeck();
        Collections.shuffle(deck);
        
        switch (phase) {
            case "PRE_FLOP":
                communityCards.addAll(Arrays.asList(deck.get(0), deck.get(1), deck.get(2)));
                phase = "FLOP";
                break;
            case "FLOP":
                communityCards.add(deck.get(0));
                phase = "TURN";
                break;
            case "TURN":
                communityCards.add(deck.get(0));
                phase = "RIVER";
                break;
            case "RIVER":
                phase = "SHOWDOWN";
                determineWinner();
                break;
        }
        
        currentBet = 0L;
        playerBets.replaceAll((k, v) -> 0L);
    }
    
    public boolean isGameComplete() {
        return phase.equals("SHOWDOWN") || players.size() == 1;
    }
    
    private void nextPlayer() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
    }
    
    private void determineWinner() {
        if (!players.isEmpty()) {
            winnerId = players.get(0);
        }
    }
    
    private List<String> createDeck() {
        List<String> deck = new ArrayList<>();
        String[] suits = {"♠", "♥", "♦", "♣"};
        String[] ranks = {"2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"};
        
        for (String suit : suits) {
            for (String rank : ranks) {
                deck.add(rank + suit);
            }
        }
        return deck;
    }
}
