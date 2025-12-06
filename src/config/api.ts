export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  CLIENTS: {
    LIST: '/api/clients',
    GET: (id: string) => `/api/clients/${id}`,
    CREATE: '/api/clients',
    UPDATE: (id: string) => `/api/clients/${id}`,
    DELETE: (id: string) => `/api/clients/${id}`,
  },
  MEASUREMENTS: {
    LIST: '/api/measurements',
    GET: (id: string) => `/api/measurements/${id}`,
    CREATE: '/api/measurements',
    UPDATE: (id: string) => `/api/measurements/${id}`,
    DELETE: (id: string) => `/api/measurements/${id}`,
  },
  ORDERS: {
    LIST: '/api/orders',
    GET: (id: string) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    UPDATE: (id: string) => `/api/orders/${id}`,
    DELETE: (id: string) => `/api/orders/${id}`,
  },
  TEMPLATES: {
    LIST: '/api/measurement-templates',
    GET: (id: string) => `/api/measurement-templates/${id}`,
    CREATE: '/api/measurement-templates',
    UPDATE: (id: string) => `/api/measurement-templates/${id}`,
    DELETE: (id: string) => `/api/measurement-templates/${id}`,
  },
  APPOINTMENTS: {
    LIST: '/api/appointments',
    GET: (id: string) => `/api/appointments/${id}`,
    CREATE: '/api/appointments',
    UPDATE: (id: string) => `/api/appointments/${id}`,
    DELETE: (id: string) => `/api/appointments/${id}`,
  },
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    UNREAD_COUNT: '/api/notifications/unread-count',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
  },
  USERS: {
    ME: '/api/users/me',
    UPDATE: (id: string) => `/api/users/${id}`,
  },
  STATISTICS: '/api/statistics',
};
