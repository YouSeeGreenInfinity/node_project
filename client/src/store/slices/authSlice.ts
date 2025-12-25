import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { AuthResponse, LoginData, RegisterData, SafeUser } from '../../types/user';
import { AuthResponse as ApiAuthResponse } from '../../types/user';

interface AuthState {
  user: SafeUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const getStoredToken = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    return token || null;
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
};

const getStoredUser = (): SafeUser | null => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData || userData === 'undefined' || userData === 'null') {
      return null;
    }
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    localStorage.removeItem('user');
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isLoading: false,
  error: null,
  success: null,
};

const getErrorMessage = (error: any): string => {
  console.log('🔍 Analyzing error:', error);

  if (error?.response?.data) {
    const data = error.response.data; 
    console.log('🔍 Server Data:', data);

    if (data.message && typeof data.message === 'string' && data.message.trim() !== '') {
      return data.message;
    }
    
    if (data.error && typeof data.error === 'string' && data.error.trim() !== '') {
      return data.error;
    }
  }

  if (error?.response?.status === 401) {
      return "Неверный email или пароль (401)";
  }
  if (error?.response?.status === 403) {
      return "Доступ запрещен (403)";
  }
  if (error?.response?.status === 404) {
      return "Сервер не найден (404)";
  }

  if (error?.message) return error.message;

  return 'Неизвестная ошибка (текст не найден)';
};




export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      console.log('🔄 [authSlice] register thunk starting for:', userData.email);
      const response = await authApi.register(userData);
      console.log('✅ [authSlice] register thunk success for:', userData.email);
      return response;
    } catch (error: any) {
      console.error('❌ [authSlice] register thunk caught error:', error);
      const errorMessage = getErrorMessage(error);
      console.error('❌ [authSlice] Error message:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      console.log('🔄 [authSlice] login thunk starting for:', credentials.email);
      const response = await authApi.login(credentials);
      console.log('✅ [authSlice] login thunk success');
      return response;
    } catch (error: any) {
      console.error('❌ [authSlice] login thunk caught error:', error);
      
      const message = getErrorMessage(error);
      
      console.log('❌ [authSlice] Extracted error message:', message);
      
      return rejectWithValue(message);
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getMe();
      return user;
    } catch (error: any) {
      console.error('❌ [authSlice] getMe API error:', error);
      const errorMessage = getErrorMessage(error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.success = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setUser: (state, action: PayloadAction<SafeUser>) => {
      state.user = action.payload;
      try {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        console.log('⏳ [authSlice] register.pending');
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        const { user, token } = action.payload.data; 

        state.user = user as unknown as SafeUser; 
        state.token = token;
        
        state.success = 'Регистрация успешно завершена!';
        
        try {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Error saving auth data to localStorage:', error);
        }
      })
      .addCase(register.rejected, (state, action) => {
        console.log('❌ [authSlice] register.rejected');
        console.log('❌ [authSlice] action payload:', action.payload);
        console.log('❌ [authSlice] action error:', action.error);
        state.isLoading = false;
        state.error = action.payload as string || 'Ошибка регистрации';
      })
      
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<ApiAuthResponse>) => { // Используем правильный тип
        console.log('✅ [authSlice] login.fulfilled payload:', action.payload);
        state.isLoading = false;
        
        const responseData = action.payload.data || action.payload;

        state.user = responseData.user as unknown as SafeUser;
        state.token = responseData.token;
        
        state.success = 'Вход выполнен успешно!';
        try {
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('user', JSON.stringify(responseData.user));
        } catch (error) {
          console.error('Error saving auth data to localStorage:', error);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        
                if (action.payload) {
          state.error = action.payload as string;
        } 
        else {
           state.error = action.error.message || 'Ошибка авторизации';
        }
      })
      
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<SafeUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        try {
          localStorage.setItem('user', JSON.stringify(action.payload));
        } catch (error) {
          console.error('Error saving user to localStorage:', error);
        }
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        if (action.payload === 'Ошибка получения данных пользователя') {
          state.user = null;
          state.token = null;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      });
  },
});

export const { logout, clearError, clearSuccess, setUser } = authSlice.actions;
export default authSlice.reducer;
