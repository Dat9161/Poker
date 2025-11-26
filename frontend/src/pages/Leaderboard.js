import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await userService.getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <button onClick={() => navigate('/lobby')} className="btn btn-secondary">
          ← Quay lại Lobby
        </button>
        <h1>🏆 Bảng xếp hạng</h1>
      </div>

      <div className="leaderboard-content">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Người chơi</th>
              <th>Chips</th>
              <th>Tổng ván</th>
              <th>Thắng</th>
              <th>Thua</th>
              <th>Tỷ lệ thắng</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={player.id} className={index < 3 ? `top-${index + 1}` : ''}>
                <td className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && index + 1}
                </td>
                <td className="username">{player.username}</td>
                <td className="chips">💰 {player.chips.toLocaleString()}</td>
                <td>{player.totalGames}</td>
                <td className="wins">{player.wins}</td>
                <td className="losses">{player.losses}</td>
                <td className="win-rate">{player.winRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {leaderboard.length === 0 && (
          <div className="no-data">
            <p>Chưa có dữ liệu xếp hạng</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
