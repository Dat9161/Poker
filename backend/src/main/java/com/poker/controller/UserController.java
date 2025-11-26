package com.poker.controller;

import com.poker.dto.UserDTO;
import com.poker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getUserProfile(username));
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserDTO>> getLeaderboard() {
        return ResponseEntity.ok(userService.getLeaderboard());
    }
}
