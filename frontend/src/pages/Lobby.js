import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService, userService } from '../services/api';
import './Lobby.css';

function Lobby() {
  const [rooms, setRooms] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
    loadProfile();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await roomService.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await roomService.createRoom({
        name: roomName,
        maxPlayers: 6,
        smallBlind: 10,
        bigBlind: 20
      });
      navigate(`/game/${response.data.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/game/${roomId}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <h1>🃏 Poker Lobby</h1>
        <div className="user-info">
          {profile && (
            <>
              <span className="username">{profile.username}</span>
              <span className="chips">💰 {profile.chips} chips</span>
              <button onClick={() => navigate('/leaderboard')} className="btn btn-secondary">
                Bảng xếp hạng
              </button>
              <button onClick={handleLogout} className="btn btn-danger">
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>

      <div className="lobby-content">
        <div className="rooms-section">
          <div className="section-header">
            <h2>Phòng chơi</h2>
            <button 
              onClick={() => setShowCreateRoom(!showCreateRoom)} 
              className="btn btn-primary"
            >
              + Tạo phòng mới
            </button>
          </div>

          {showCreateRoom && (
            <div className="create-room-form">
              <form onSubmit={handleCreateRoom}>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Tên phòng"
                  required
                />
                <button type="submit" className="btn btn-primary">Tạo</button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateRoom(false)}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
              </form>
            </div>
          )}

          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <h3>{room.name}</h3>
                <div className="room-info">
                  <p>Blinds: {room.smallBlind}/{room.bigBlind}</p>
                  <p>Max: {room.maxPlayers} người chơi</p>
                  <p className={`status ${room.status.toLowerCase()}`}>
                    {room.status === 'WAITING' ? 'Đang chờ' : 'Đang chơi'}
                  </p>
                </div>
                <button 
                  onClick={() => handleJoinRoom(room.id)}
                  className="btn btn-primary btn-block"
                  disabled={room.status !== 'WAITING'}
                >
                  Tham gia
                </button>
              </div>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="no-rooms">
              <p>Chưa có phòng nào. Hãy tạo phòng mới!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lobby;
