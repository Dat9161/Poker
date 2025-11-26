import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import websocketService from '../services/websocket';
import './GameRoom.css';

function GameRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [raiseAmount, setRaiseAmount] = useState(0);
  const userId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {
    websocketService.connect(
      () => {
        console.log('WebSocket connected');
        websocketService.subscribeToGame(roomId, handleGameUpdate);
        websocketService.joinGame(roomId, userId);
      },
      (error) => {
        console.error('WebSocket error:', error);
      }
    );

    return () => {
      websocketService.disconnect();
    };
  }, [roomId, userId]);

  const handleGameUpdate = (data) => {
    setGameState(data);
  };

  const handleAction = (action, amount = 0) => {
    websocketService.sendGameAction(roomId, {
      userId: userId,
      action: action,
      amount: amount
    });
  };

  const getPlayerCards = () => {
    if (!gameState || !gameState.playerCards) return [];
    return gameState.playerCards[userId] || [];
  };

  const getCurrentPlayer = () => {
    if (!gameState || !gameState.players || gameState.players.length === 0) return null;
    return gameState.players[gameState.currentPlayerIndex];
  };

  const isMyTurn = () => {
    return getCurrentPlayer() === userId;
  };

  return (
    <div className="game-room">
      <div className="game-header">
        <button onClick={() => navigate('/lobby')} className="btn btn-secondary">
          ← Rời phòng
        </button>
        <h2>Phòng #{roomId}</h2>
        <div className="game-info">
          <span>Pot: 💰 {gameState?.pot || 0}</span>
          <span>Phase: {gameState?.phase || 'WAITING'}</span>
        </div>
      </div>

      <div className="game-table">
        <div className="community-cards">
          <h3>Bài chung</h3>
          <div className="cards">
            {gameState?.communityCards?.map((card, index) => (
              <div key={index} className="card">{card}</div>
            ))}
            {(!gameState?.communityCards || gameState.communityCards.length === 0) && (
              <div className="card-placeholder">Chưa chia bài</div>
            )}
          </div>
        </div>

        <div className="players-area">
          <h3>Người chơi ({gameState?.players?.length || 0})</h3>
          <div className="players-list">
            {gameState?.players?.map((playerId, index) => (
              <div 
                key={playerId} 
                className={`player-info ${playerId === userId ? 'current-user' : ''} ${isMyTurn() && playerId === userId ? 'active-turn' : ''}`}
              >
                <div className="player-name">
                  Player {playerId}
                  {playerId === userId && ' (Bạn)'}
                  {isMyTurn() && playerId === userId && ' 🎯'}
                </div>
                <div className="player-chips">
                  💰 {gameState.playerChips?.[playerId] || 0}
                </div>
                <div className="player-bet">
                  Bet: {gameState.playerBets?.[playerId] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="player-hand">
          <h3>Bài của bạn</h3>
          <div className="cards">
            {getPlayerCards().map((card, index) => (
              <div key={index} className="card player-card">{card}</div>
            ))}
            {getPlayerCards().length === 0 && (
              <div className="card-placeholder">Chờ chia bài</div>
            )}
          </div>
        </div>

        <div className="game-actions">
          {gameState?.started && isMyTurn() ? (
            <>
              <button 
                onClick={() => handleAction('FOLD')} 
                className="btn btn-danger"
              >
                Fold
              </button>
              <button 
                onClick={() => handleAction('CHECK')} 
                className="btn btn-secondary"
              >
                Check
              </button>
              <button 
                onClick={() => handleAction('CALL')} 
                className="btn btn-primary"
              >
                Call ({gameState.currentBet || 0})
              </button>
              <div className="raise-controls">
                <input
                  type="number"
                  value={raiseAmount}
                  onChange={(e) => setRaiseAmount(parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="Số tiền raise"
                />
                <button 
                  onClick={() => handleAction('RAISE', raiseAmount)} 
                  className="btn btn-primary"
                >
                  Raise
                </button>
              </div>
            </>
          ) : (
            <div className="waiting-message">
              {!gameState?.started ? 'Đang chờ người chơi...' : 'Chờ lượt của bạn...'}
            </div>
          )}
        </div>
      </div>

      {gameState?.winnerId && (
        <div className="game-result">
          <h2>🎉 Người thắng: Player {gameState.winnerId}</h2>
          <p>Pot: 💰 {gameState.pot}</p>
        </div>
      )}
    </div>
  );
}

export default GameRoom;
