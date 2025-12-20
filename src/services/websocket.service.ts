import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { authService } from './index';

class WebSocketService {
  private stompClient: CompatClient | null = null;
  private connected = false;

  connect(onNotification: (notification: any) => void): void {
    const user = authService.getUser();
    const token = authService.getToken();
    if (!user?.id || !token || this.connected) return;

    const wsUrl = import.meta.env.VITE_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:8080';
    const socket = new SockJS(`${wsUrl}/ws/notifications?token=${token}`);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.connected = true;
      this.stompClient?.subscribe(`/topic/notifications/${user.id}`, (message) => {
        const notification = JSON.parse(message.body);
        onNotification(notification);
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
      this.connected = false;
    });
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
    }
  }
}

export default new WebSocketService();
