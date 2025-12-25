import apiClient from "./apiClient";
import {
  LoginData,
  RegisterData,
  SafeUser,
  UpdateProfileData,
  AuthResponse,
  ChangePasswordData,
  BlockUserResponse,
} from "../types/user";

// Вспомогательная функция для извлечения текста ошибки
const extractErrorMessage = (error: any): string => {
  if (error.response) {
    const data = error.response.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return `Ошибка сервера: ${error.response.status}`;
  }
  if (error.request) {
    return "Нет ответа от сервера. Проверьте соединение.";
  }
  return error.message || "Неизвестная ошибка запроса";
};

export const authApi = {
  // Регистрация
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const requestData = {
        ...data,
        birthDate: data.birthDate.toISOString().split("T")[0],
      };

      const response = await apiClient.post("/api/auth/register", requestData);

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data; // Возвращает { success: true, data: { user, token } }
    } catch (error: any) {
      throw extractErrorMessage(error);
    }
  },

  // Авторизация
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post("/api/auth/login", data);
      if (response.data.token) {
        // В вашем API токен может быть внутри data.token или просто token
        // Сервер возвращает: { success: true, data: { user, token } }
        // Значит токен тут: response.data.data.token
        const token = response.data.data?.token || response.data.token;
        const user = response.data.data?.user || response.data.user;

        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
      }
      return response.data;
    } catch (error: any) {
      throw extractErrorMessage(error);
    }
  },

  // Получить текущего пользователя
  getMe: async (): Promise<SafeUser> => {
    try {
      const response = await apiClient.get("/api/auth/me");
      // Сервер: { data: { user } }
      return response.data.data?.user || response.data.user || response.data;
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  // Получить пользователя по ID
  getUserById: async (id: number): Promise<SafeUser> => {
    try {
      const response = await apiClient.get(`/api/users/${id}`);
      // Сервер: { data: { user } }
      return response.data.data?.user || response.data;
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  // ИСПРАВЛЕНИЕ: Получить список пользователей
  getUsers: async (): Promise<SafeUser[]> => {
    try {
      const response = await apiClient.get("/api/users");
      // Ваш сервер возвращает: { success: true, data: [user1, user2], pagination: {...} }
      // Нам нужен именно массив из поля data

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      // Если пагинация в другом формате, пробуем rows
      if (response.data && Array.isArray(response.data.rows)) {
        return response.data.rows;
      }

      console.error("Неизвестный формат ответа getUsers:", response.data);
      return [];
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  // Обновить пользователя
  updateUser: (id: number, data: UpdateProfileData): Promise<SafeUser> =>
    apiClient
      .put(`/api/users/${id}`, {
        ...data,
        birthDate: data.birthDate
          ? data.birthDate.toISOString().split("T")[0]
          : undefined,
      })
      .then((res) => res.data.data?.user || res.data),

  // Смена пароля
  changePassword: (
    id: number,
    data: ChangePasswordData
  ): Promise<{ message: string }> =>
    apiClient.patch(`/api/users/${id}/password`, data).then((res) => res.data),

  // Блокировка/разблокировка
  toggleBlock: async (
    id: number,
    isActive: boolean
  ): Promise<BlockUserResponse> => {
    try {
      const response = await apiClient.patch(`/api/users/${id}/block`, {
        isActive,
      });
      // Сервер: { success: true, data: { user: { ...isActive... } } }
      const user = response.data.data?.user || response.data;
      return { isActive: user.isActive };
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  // Выход
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  checkHealth: (): Promise<{ status: string }> =>
    apiClient.get("/health").then((res) => res.data),
};
