import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { SafeUser } from '../../types/user';

interface UsersState {
  users: SafeUser[];
  currentUser: SafeUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

// Асинхронные thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await authApi.getUsers();
      return users;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки пользователей'
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: number, { rejectWithValue }) => {
    try {
      const user = await authApi.getUserById(userId);
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const user = await authApi.updateUser(id, data);
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка обновления пользователя'
      );
    }
  }
);

export const toggleBlockUser = createAsyncThunk(
  'users/toggleBlock',
  // Принимаем { id, isActive }
  async ({ id, isActive }: { id: number; isActive: boolean }, { rejectWithValue }) => {
    try {
      // Передаем оба параметра в API
      const response = await authApi.toggleBlock(id, isActive);
      // Возвращаем то, что нужно для reducer'а
      return { userId: id, isActive: response.isActive };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка блокировки пользователя'
      );
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<SafeUser>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<SafeUser[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<SafeUser>) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<SafeUser>) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        // Обновляем пользователя в списке
        state.users = state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Toggle Block
      .addCase(toggleBlockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновляем статус в списке пользователей
        state.users = state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, isActive: action.payload.isActive }
            : user
        );
        // Обновляем текущего пользователя если это он
        if (state.currentUser?.id === action.payload.userId) {
          state.currentUser = {
            ...state.currentUser,
            isActive: action.payload.isActive,
          };
        }
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsersError, setCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;