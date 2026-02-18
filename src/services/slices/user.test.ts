import userReducer, {
  checkUserAuth,
  login,
  register,
  updateUser,
  logout,
  setAuthChecked,
  clearError,
  selectUser,
  selectIsAuthChecked,
  selectIsLoading,
  selectError,
  selectIsAuthenticated
} from './userSlice';
import { mockUser } from './__mocks__/user.mock';

jest.mock('../../utils/burger-api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('user слайс', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('checkUserAuth', () => {
    it('должен установить статус загрузки при проверке авторизации', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сохранить данные пользователя и завершить проверку авторизации', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('должен завершить проверку авторизации без данных пользователя', () => {
      const action = { type: checkUserAuth.rejected.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('login', () => {
    it('должен установить статус загрузки при входе', () => {
      const action = { type: login.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные пользователя при успешном входе', () => {
      const action = {
        type: login.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при неудачном входе', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: login.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('register', () => {
    it('должен установить статус загрузки при регистрации', () => {
      const action = { type: register.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные пользователя при успешной регистрации', () => {
      const action = {
        type: register.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при неудачной регистрации', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: register.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateUser', () => {
    it('должен установить статус загрузки при обновлении данных', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обновить данные пользователя при успешном обновлении', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при неудачном обновлении', () => {
      const errorMessage = 'Ошибка обновления пользователя';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logout', () => {
    it('должен установить статус загрузки при выходе', () => {
      const action = { type: logout.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен очистить данные пользователя при успешном выходе', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser
      };

      const action = { type: logout.fulfilled.type };
      const state = userReducer(loggedInState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при неудачном выходе', () => {
      const errorMessage = 'Ошибка выхода из аккаунта';
      const action = {
        type: logout.rejected.type,
        payload: errorMessage
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('редюсеры', () => {
    it('setAuthChecked должен изменить статус проверки авторизации', () => {
      const action = setAuthChecked(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    it('clearError должен очистить сохраненную ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };

      const action = clearError();
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('селекторы', () => {
    const sliceState = {
      user: mockUser,
      isAuthChecked: true,
      isLoading: false,
      error: null
    };

    const rootState = {
      user: sliceState,
      burgerConstructor: { bun: null, ingredients: [] },
      ingredients: { items: [], loading: false, error: null },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      order: {
        orders: [],
        orderByNumberResponse: null,
        request: false,
        responseOrder: null,
        error: null,
        orderData: null
      }
    };

    it('selectUser должен вернуть данные пользователя', () => {
      expect(selectUser(rootState)).toEqual(mockUser);
    });

    it('selectIsAuthChecked должен вернуть статус проверки авторизации', () => {
      expect(selectIsAuthChecked(rootState)).toBe(true);
    });

    it('selectIsLoading должен вернуть статус загрузки', () => {
      expect(selectIsLoading(rootState)).toBe(false);
    });

    it('selectError должен вернуть сохраненную ошибку', () => {
      expect(selectError(rootState)).toBeNull();
    });

    it('selectIsAuthenticated должен вернуть true если пользователь авторизован', () => {
      expect(selectIsAuthenticated(rootState)).toBe(true);
    });

    it('selectIsAuthenticated должен вернуть false если пользователь не авторизован', () => {
      const emptyState = {
        ...rootState,
        user: { user: null, isAuthChecked: true, isLoading: false, error: null }
      };
      expect(selectIsAuthenticated(emptyState)).toBe(false);
    });
  });
});
