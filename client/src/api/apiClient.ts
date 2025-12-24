import axios from 'axios';

const API_URL = 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Проверяем, что это ошибка 401
    if (error.response?.status === 401) {
      
      // ВАЖНО: Не делаем редирект, если это запрос логина.
      // Пусть компонент Login сам обработает ошибку "Неверный пароль"
      if (error.config.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      // Для остальных запросов (например, получение профиля) - очищаем токен и редиректим
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Проверяем, что мы уже не на странице логина/регистрации, чтобы не циклиться
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
