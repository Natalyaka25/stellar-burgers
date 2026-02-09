import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface IUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        setCookie('accessToken', accessToken);
      }
      return response.user;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

export const login = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (loginData, { rejectWithValue }) => {
  try {
    const { success, user, refreshToken, accessToken } =
      await loginUserApi(loginData);
    if (!success) {
      return rejectWithValue('Не удалось авторизоваться');
    }
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);
    setCookie('accessToken', accessToken);
    return user;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message || 'Ошибка авторизации';
    return rejectWithValue(errorMessage);
  }
});

export const register = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (registerData, { rejectWithValue }) => {
  try {
    const { success, user, refreshToken, accessToken } =
      await registerUserApi(registerData);
    if (!success) {
      return rejectWithValue('Не удалось зарегистрировать пользователя');
    }
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);
    setCookie('accessToken', accessToken);
    return user;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message || 'Ошибка регистрации';
    return rejectWithValue(errorMessage);
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (userData, { rejectWithValue }) => {
  try {
    const { success, user } = await updateUserApi(userData);
    if (!success) {
      return rejectWithValue('Не удалось обновить данные пользователя');
    }
    return user;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message ||
      'Ошибка обновления пользователя';
    return rejectWithValue(errorMessage);
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { success } = await logoutApi();
      if (!success) {
        return rejectWithValue('Не удалось выйти из аккаунта');
      }
      deleteCookie('accessToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      const errorMessage =
        (error as { message?: string }).message || 'Ошибка выхода из аккаунта';
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectIsAuthenticated: (state) => !!state.user
  },
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setAuthChecked, clearError } = userSlice.actions;
export const {
  selectUser,
  selectIsAuthChecked,
  selectIsLoading,
  selectError,
  selectIsAuthenticated
} = userSlice.selectors;
export default userSlice.reducer;
