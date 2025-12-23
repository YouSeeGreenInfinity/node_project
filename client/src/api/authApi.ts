import apiClient from './apiClient';
import {
  LoginData,
  RegisterData,
  SafeUser,
  UpdateProfileData,
  AuthResponse,
  ChangePasswordData,
  BlockUserResponse
} from '../types/user';

export const authApi = {
  // Регистрация
  register: (data: RegisterData): Promise<AuthResponse> =>
    apiClient.post('/api/auth/register', {
      ...data,
      birthDate: data.birthDate.toISOString().split('T')[0] // Форматируем дату
    }).then(res => {
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    }),

  // Авторизация
  login: (data: LoginData): Promise<AuthResponse> =>
    apiClient.post('/api/auth/login', data).then(res => {
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    }),

  // Получить текущего пользователя
  getMe: (): Promise<SafeUser> =>
    apiClient.get('/api/auth/me').then(res => res.data),

  // Получить пользователя по ID
  getUserById: (id: number): Promise<SafeUser> =>
    apiClient.get(`/api/users/${id}`).then(res => res.data),

  // Обновить пользователя
  updateUser: (id: number, data: UpdateProfileData): Promise<SafeUser> =>
    apiClient.put(`/api/users/${id}`, {
      ...data,
      birthDate: data.birthDate ? data.birthDate.toISOString().split('T')[0] : undefined
    }).then(res => res.data),

  // Смена пароля
  changePassword: (id: number, data: ChangePasswordData): Promise<{ message: string }> =>
    apiClient.patch(`/api/users/${id}/password`, data).then(res => res.data),

  // Получить список пользователей (только админ)
  getUsers: (): Promise<SafeUser[]> =>
    apiClient.get('/api/users').then(res => res.data),

  // Блокировка/разблокировка пользователя
  toggleBlock: (id: number): Promise<BlockUserResponse> =>
    apiClient.patch(`/api/users/${id}/block`).then(res => res.data),

  // Выход
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Проверка здоровья
  checkHealth: (): Promise<{ status: string }> =>
    apiClient.get('/health').then(res => res.data),
};