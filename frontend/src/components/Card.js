import React from 'react';
import './Card.css';

function Card({ value, suit, isPlayerCard = false }) {
  const getCardColor = () => {
    if (suit === '♥' || suit === '♦') return 'red';
    return 'black';
  };

  return (
    <div className={`poker-card ${isPlayerCard ? 'player-card' : ''}`}>
      <div className={`card-content ${getCardColor()}`}>
        <div className="card-value">{value}</div>
        <div className="card-suit">{suit}</div>
      </div>
    </div>
  );
}

export default Card;
