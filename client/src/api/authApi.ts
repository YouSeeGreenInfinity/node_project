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


const handleApiError = (error: any): Promise<never> => {
  console.error('API Error:', error);
  
  let errorMessage = 'Произошла неизвестная ошибка';
  
  if (error.response) {
    // Сервер ответил с ошибкой
    const { data, status } = error.response;
    console.error('Server error response:', { status, data });
    
    errorMessage = data?.message || data?.error || `Ошибка сервера: ${status}`;
  } else if (error.request) {
    // Запрос был сделан, но ответа нет
    console.error('No response received:', error.request);
    errorMessage = 'Нет ответа от сервера. Проверьте подключение к интернету.';
  } else {
    // Что-то пошло не так при настройке запроса
    console.error('Request setup error:', error.message);
    errorMessage = `Ошибка запроса: ${error.message}`;
  }
  
  // Возвращаем отклоненный Promise
  return Promise.reject(new Error(errorMessage));
};


export const authApi = {
  // Регистрация
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const requestData = {
        ...data,
        birthDate: data.birthDate.toISOString().split('T')[0]
      };
      
      console.log('📤 Sending registration request for:', data.email);
      
      const response = await apiClient.post('/api/auth/register', requestData);
      
      console.log('✅ Registration successful:', response.data);
      
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed with error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      // Извлекаем сообщение об ошибке
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Ошибка регистрации';
      
      console.log('❌ Throwing error:', errorMessage);
      throw new Error(errorMessage);
    }
  },

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
  // Принимаем isActive: true (разблокировать) или false (заблокировать)
  toggleBlock: (id: number, isActive: boolean): Promise<BlockUserResponse> =>
    apiClient.patch(`/api/users/${id}/block`, { isActive }).then(res => res.data),

  // Выход
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Проверка здоровья
  checkHealth: (): Promise<{ status: string }> =>
    apiClient.get('/health').then(res => res.data),
};