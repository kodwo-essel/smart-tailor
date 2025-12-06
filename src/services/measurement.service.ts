import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

export interface Measurement {
  id: string;
  clientId: string;
  templateId: string;
  measurementName: string;
  measurements: { [key: string]: string };
  date: string;
}

class MeasurementService {
  async getAll(): Promise<Measurement[]> {
    return apiService.get<Measurement[]>(API_ENDPOINTS.MEASUREMENTS.LIST);
  }

  async getByClientId(clientId: string): Promise<Measurement[]> {
    return apiService.get<Measurement[]>(`/api/clients/${clientId}/measurements`);
  }

  async getById(id: string): Promise<Measurement> {
    return apiService.get<Measurement>(API_ENDPOINTS.MEASUREMENTS.GET(id));
  }

  async create(data: Partial<Measurement>): Promise<Measurement> {
    return apiService.post<Measurement>(API_ENDPOINTS.MEASUREMENTS.CREATE, data);
  }

  async createForClient(clientId: string, data: { type: string; data: { [key: string]: string } }): Promise<Measurement> {
    return apiService.post<Measurement>(`/api/clients/${clientId}/measurements`, data);
  }

  async update(id: string, data: Partial<Measurement>): Promise<Measurement> {
    return apiService.put<Measurement>(API_ENDPOINTS.MEASUREMENTS.UPDATE(id), data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.MEASUREMENTS.DELETE(id));
  }
}

export default new MeasurementService();
