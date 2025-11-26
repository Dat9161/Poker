-- Poker Database Schema

CREATE DATABASE IF NOT EXISTS poker_db;
USE poker_db;

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    chips BIGINT DEFAULT 1000,
    total_games INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Bảng phòng chơi
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    max_players INT DEFAULT 6,
    small_blind BIGINT DEFAULT 10,
    big_blind BIGINT DEFAULT 20,
    status VARCHAR(20) DEFAULT 'WAITING',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status)
);

-- Bảng người chơi trong phòng
CREATE TABLE IF NOT EXISTS room_players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    position INT NOT NULL,
    chips BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_room_user (room_id, user_id),
    INDEX idx_room (room_id),
    INDEX idx_user (user_id)
);

-- Bảng lịch sử game
CREATE TABLE IF NOT EXISTS game_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    winner_id BIGINT,
    pot_amount BIGINT NOT NULL,
    winning_hand VARCHAR(50),
    players_count INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_room (room_id),
    INDEX idx_winner (winner_id),
    INDEX idx_played_at (played_at)
);

-- Bảng chi tiết người chơi trong game
CREATE TABLE IF NOT EXISTS game_players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    starting_chips BIGINT NOT NULL,
    ending_chips BIGINT NOT NULL,
    final_hand VARCHAR(100),
    position INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES game_history(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_game (game_id),
    INDEX idx_user (user_id)
);

-- Bảng xếp hạng (view)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.id,
    u.username,
    u.chips,
    u.total_games,
    u.wins,
    u.losses,
    CASE 
        WHEN u.total_games > 0 THEN ROUND((u.wins * 100.0 / u.total_games), 2)
        ELSE 0 
    END AS win_rate
FROM users u
ORDER BY u.chips DESC, u.wins DESC
LIMIT 100;

-- Sample data
INSERT INTO users (username, email, password, chips, total_games, wins, losses) VALUES
('player1', 'player1@poker.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1500, 10, 6, 4),
('player2', 'player2@poker.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2000, 15, 10, 5),
('player3', 'player3@poker.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 800, 8, 2, 6);
-- Password for all: password123

INSERT INTO rooms (name, max_players, small_blind, big_blind, status, created_by) VALUES
('Beginner Room', 6, 10, 20, 'WAITING', 1),
('Intermediate Room', 6, 50, 100, 'WAITING', 2),
('VIP Room', 6, 100, 200, 'WAITING', 2);
