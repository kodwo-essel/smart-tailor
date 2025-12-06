import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

export interface Order {
  id: string;
  name: string;
  notes: string;
  price: number;
  dueDate: string;
  status: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
  };
  tailor: {
    id: string;
    name: string;
  };
  measurement: {
    id: string;
    type: string;
    data: { [key: string]: string };
  };
}

class OrderService {
  async getAll(): Promise<Order[]> {
    return apiService.get<Order[]>(API_ENDPOINTS.ORDERS.LIST);
  }

  async getById(id: string): Promise<Order> {
    return apiService.get<Order>(API_ENDPOINTS.ORDERS.GET(id));
  }

  async create(data: Partial<Order>): Promise<Order> {
    return apiService.post<Order>(API_ENDPOINTS.ORDERS.CREATE, data);
  }

  async update(id: string, data: any): Promise<Order> {
    const { measurementId, ...body } = data;
    const url = measurementId 
      ? `${API_ENDPOINTS.ORDERS.UPDATE(id)}?measurementId=${measurementId}`
      : API_ENDPOINTS.ORDERS.UPDATE(id);
    return apiService.put<Order>(url, body);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.ORDERS.DELETE(id));
  }
}

export default new OrderService();
