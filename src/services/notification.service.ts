import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  order?: {
    id: string;
    name: string;
    clientName: string;
  };
}

class NotificationService {
  async getAll(): Promise<Notification[]> {
    return apiService.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST);
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiService.get<{ unreadCount: number }>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return response.unreadCount || 0;
  }

  async markAsRead(id: string): Promise<void> {
    return apiService.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {});
  }

  async markAllAsRead(): Promise<void> {
    return apiService.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {});
  }
}

export default new NotificationService();
