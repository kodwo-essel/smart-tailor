import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { authService } from './index';

class WebSocketService {
  private stompClient: CompatClient | null = null;
  private connected = false;

  connect(onNotification: (notification: any) => void): void {
    const user = authService.getUser();
    if (!user?.id || this.connected) return;

    const socket = new SockJS('http://localhost:8080/ws/notifications');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.connected = true;
      this.stompClient?.subscribe(`/topic/notifications/${user.id}`, (message) => {
        const notification = JSON.parse(message.body);
        onNotification(notification);
      });
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
