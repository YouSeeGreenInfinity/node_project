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

const getErrorString = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Неизвестная ошибка';
};


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await authApi.getUsers();
      if (!Array.isArray(users) && (users as any).rows) {
          return (users as any).rows;
      }
      return users;
    } catch (error: any) {
      return rejectWithValue(getErrorString(error));
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
      return rejectWithValue(getErrorString(error));
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
      return rejectWithValue(getErrorString(error));
    }
  }
);

export const toggleBlockUser = createAsyncThunk(
  'users/toggleBlock',
  async ({ id, isActive }: { id: number; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await authApi.toggleBlock(id, isActive);
      const newStatus = response?.isActive ?? isActive;
      return { userId: id, isActive: newStatus };
    } catch (error: any) {
      return rejectWithValue(getErrorString(error));
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
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload as SafeUser[];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Ошибка загрузки пользователей';
      })
      
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload as SafeUser;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload as SafeUser;
        state.users = state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ) as SafeUser[];
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(toggleBlockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, isActive: action.payload.isActive }
            : user
        );
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
