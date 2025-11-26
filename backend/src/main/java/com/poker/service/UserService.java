package com.poker.service;

import com.poker.dto.UserDTO;
import com.poker.model.User;
import com.poker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }
    
    public List<UserDTO> getLeaderboard() {
        return userRepository.findTopPlayers().stream()
                .limit(100)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setChips(user.getChips());
        dto.setTotalGames(user.getTotalGames());
        dto.setWins(user.getWins());
        dto.setLosses(user.getLosses());
        dto.setWinRate(user.getTotalGames() > 0 ? 
                (user.getWins() * 100.0 / user.getTotalGames()) : 0.0);
        return dto;
    }
}
