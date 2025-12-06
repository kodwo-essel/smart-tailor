import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

export interface Client {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  notes: string;
  createdAt: string;
}

class ClientService {
  async getAll(): Promise<Client[]> {
    return apiService.get<Client[]>(API_ENDPOINTS.CLIENTS.LIST);
  }

  async getById(id: string): Promise<Client> {
    return apiService.get<Client>(API_ENDPOINTS.CLIENTS.GET(id));
  }

  async create(data: Partial<Client>): Promise<Client> {
    return apiService.post<Client>(API_ENDPOINTS.CLIENTS.CREATE, data);
  }

  async update(id: string, data: Partial<Client>): Promise<Client> {
    return apiService.put<Client>(API_ENDPOINTS.CLIENTS.UPDATE(id), data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.CLIENTS.DELETE(id));
  }
}

export default new ClientService();
