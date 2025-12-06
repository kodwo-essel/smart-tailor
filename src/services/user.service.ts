import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  appointmentsEnabled: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  role: string;
  subscriptionPlan: SubscriptionPlan;
  createdAt: string;
}

class UserService {
  async getMe(): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.USERS.ME);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return apiService.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return apiService.get<SubscriptionPlan[]>('/api/subscription-plans');
  }

  async updateSubscription(planId: string): Promise<User> {
    return apiService.put<User>(`/api/users/me/subscription?planId=${planId}`, {});
  }
}

export default new UserService();
