import feedReducer, {
  getFeeds,
  clearFeeds,
  selectFeed,
  selectOrders,
  selectLoading
} from './feedSlice';
import { mockOrders, mockFeedResponse } from './__mocks__/feed.mock';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feed слайс', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getFeeds', () => {
    it('должен установить статус загрузки при получении ленты заказов', () => {
      const action = { type: getFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    it('должен сохранить данные ленты при успешном получении', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(150);
      expect(state.totalToday).toBe(15);
    });

    it('должен установить ошибку при неверном формате данных', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: { success: false }
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Неверный формат данных');
      expect(state.orders).toEqual([]);
    });

    it('должен использовать значения по умолчанию если данные отсутствуют', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          success: true,
          orders: null,
          total: null,
          totalToday: null
        }
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    it('должен сохранить ошибку при неудачном получении ленты', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';
      const action = {
        type: getFeeds.rejected.type,
        payload: errorMessage
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });
  });

  describe('clearFeeds', () => {
    it('должен сбросить состояние в начальное', () => {
      const loadedState = feedReducer(initialState, {
        type: getFeeds.fulfilled.type,
        payload: mockFeedResponse
      });

      expect(loadedState.orders).not.toEqual([]);
      expect(loadedState.total).toBe(150);

      const action = { type: clearFeeds.type };
      const state = feedReducer(loadedState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('селекторы', () => {
    const sliceState = {
      orders: mockOrders,
      total: 150,
      totalToday: 15,
      loading: false,
      error: null
    };

    const rootState = {
      feed: sliceState,
      burgerConstructor: { bun: null, ingredients: [] },
      ingredients: { items: [], loading: false, error: null },
      order: {
        orders: [],
        orderByNumberResponse: null,
        request: false,
        responseOrder: null,
        error: null,
        orderData: null
      },
      user: { user: null, isAuthChecked: false, isLoading: false, error: null }
    };

    it('selectFeed должен вернуть состояние слайса', () => {
      expect(selectFeed(rootState)).toEqual(sliceState);
    });

    it('selectOrders должен вернуть список заказов', () => {
      expect(selectOrders(rootState)).toEqual(mockOrders);
    });

    it('selectLoading должен вернуть статус загрузки', () => {
      expect(selectLoading(rootState)).toBe(false);
    });
  });
});
