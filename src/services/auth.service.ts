import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
    businessName: string;
    businessAddress: string;
    role: string;
    createdAt: string;
  };
}

class AuthService {
  async signup(data: SignupData): Promise<any> {
    const response = await apiService.post(API_ENDPOINTS.AUTH.SIGNUP, data);
    // No token stored during signup - user must verify email first
    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async register(data: any): Promise<any> {
    // Alias for backward compatibility
    return this.signup(data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
