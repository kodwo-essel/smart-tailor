import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

export interface Template {
  id: string;
  name: string;
  description: string;
  fields: string[];
  createdAt: string;
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

class TemplateService {
  async getAll(page: number = 0, size: number = 10): Promise<PagedResponse<Template>> {
    return apiService.get<PagedResponse<Template>>(
      `${API_ENDPOINTS.TEMPLATES.LIST}?page=${page}&size=${size}&sort=name`
    );
  }

  async getById(id: string): Promise<Template> {
    return apiService.get<Template>(API_ENDPOINTS.TEMPLATES.GET(id));
  }

  async create(data: any): Promise<Template> {
    return apiService.post<Template>(API_ENDPOINTS.TEMPLATES.CREATE, data);
  }

  async update(id: string, data: Partial<Template>): Promise<Template> {
    return apiService.put<Template>(API_ENDPOINTS.TEMPLATES.UPDATE(id), data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.TEMPLATES.DELETE(id));
  }
}

export default new TemplateService();
