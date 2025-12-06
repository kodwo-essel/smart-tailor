import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

export interface Appointment {
  id: string;
  type: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
  };
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

class AppointmentService {
  async getAll(page: number = 0, size: number = 10): Promise<PagedResponse<Appointment>> {
    return apiService.get<PagedResponse<Appointment>>(
      `${API_ENDPOINTS.APPOINTMENTS.LIST}?page=${page}&size=${size}&sort=appointmentDate,appointmentTime`
    );
  }

  async getById(id: string): Promise<Appointment> {
    return apiService.get<Appointment>(API_ENDPOINTS.APPOINTMENTS.GET(id));
  }

  async create(data: any): Promise<Appointment> {
    return apiService.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.CREATE, data);
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    return apiService.put<Appointment>(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.APPOINTMENTS.DELETE(id));
  }
}

export default new AppointmentService();
