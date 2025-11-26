import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080/ws';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  connect(onConnected, onError) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    
    this.stompClient.onConnect = () => {
      this.connected = true;
      if (onConnected) onConnected();
    };

    this.stompClient.onStompError = (error) => {
      this.connected = false;
      if (onError) onError(error);
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }

  subscribeToGame(roomId, callback) {
    if (this.stompClient && this.connected) {
      return this.stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      });
    }
  }

  sendGameAction(roomId, action) {
    if (this.stompClient && this.connected) {
      this.stompClient.publish({
        destination: `/app/game/${roomId}/action`,
        body: JSON.stringify(action)
      });
    }
  }

  joinGame(roomId, userId) {
    if (this.stompClient && this.connected) {
      this.stompClient.publish({
        destination: `/app/game/${roomId}/join`,
        body: JSON.stringify(userId)
      });
    }
  }
}

export default new WebSocketService();
