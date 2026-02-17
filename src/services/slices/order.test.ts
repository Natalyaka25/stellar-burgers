import orderReducer, {
  createOrder,
  fetchOrderByNumber,
  fetchUserOrders,
  clearOrder,
  resetOrderRequest,
  addOrder,
  getOrderState,
  selectOrderById,
  selectOrderByNumber,
  selectOrderLoading,
  selectOrderError
} from './orderSlice';
import {
  mockOrder,
  mockOrders,
  mockOrderApiResponse,
  mockOrderByNumberResponse,
  mockIngredientIds
} from './__mocks__/order.mock';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

describe('order слайс', () => {
  const initialState = {
    orders: [],
    orderByNumberResponse: null,
    request: false,
    responseOrder: null,
    error: null,
    orderData: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('должен установить статус загрузки при создании заказа', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные заказа при успешном создании', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrderApiResponse
      };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderData).toEqual(mockOrderApiResponse);
    });

    it('должен сохранить ошибку при неудачном создании заказа', () => {
      const errorMessage = 'Ошибка оформления заказа';
      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage
      };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('должен установить статус загрузки при получении заказа по номеру', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные заказа при успешном получении', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrderByNumberResponse
      };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderByNumberResponse).toEqual(mockOrder);
    });

    it('должен установить null если заказ не найден', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: { orders: [] }
      };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderByNumberResponse).toBeNull();
    });

    it('должен сохранить ошибку при неудачном получении заказа', () => {
      const errorMessage = 'Ошибка получения заказа';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: errorMessage
      };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchUserOrders', () => {
    it('должен установить статус загрузки при получении заказов пользователя', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить заказы пользователя при успешном получении', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(false);
      expect(state.error).toBeNull();

      const expectedOrders = [...mockOrders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      expect(state.orders).toEqual(expectedOrders);
    });

    it('должен заменить заказы новыми данными при повторном получении', () => {
      const firstAction = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const stateAfterFirst = orderReducer(initialState, firstAction);

      const newOrders = [mockOrders[0]];

      const secondAction = {
        type: fetchUserOrders.fulfilled.type,
        payload: newOrders
      };
      const state = orderReducer(stateAfterFirst, secondAction);

      expect(state.orders).toHaveLength(1);
      expect(state.orders).toEqual(newOrders);
    });

    it('должен сохранить ошибку при неудачном получении заказов', () => {
      const errorMessage = 'Ошибка загрузки заказов';
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: errorMessage
      };
      const state = orderReducer(initialState, action);

      expect(state.request).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('редюсеры', () => {
    it('clearOrder должен сбросить состояние в начальное', () => {
      const loadedState = {
        ...initialState,
        orders: mockOrders,
        orderData: mockOrderApiResponse,
        request: true
      };

      const action = { type: clearOrder.type };
      const state = orderReducer(loadedState, action);

      expect(state).toEqual(initialState);
    });

    it('resetOrderRequest должен сбросить статус загрузки', () => {
      const loadingState = {
        ...initialState,
        request: true
      };

      const action = { type: resetOrderRequest.type };
      const state = orderReducer(loadingState, action);

      expect(state.request).toBe(false);
    });

    it('addOrder должен добавить заказ в начало списка', () => {
      const stateWithOrders = {
        ...initialState,
        orders: [mockOrders[1], mockOrders[2]]
      };

      const action = { type: addOrder.type, payload: mockOrders[0] };
      const state = orderReducer(stateWithOrders, action);

      expect(state.orders).toHaveLength(3);
      expect(state.orders[0]).toEqual(mockOrders[0]);
    });

    it('addOrder не должен добавить заказ если данные отсутствуют', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockOrders
      };

      const action = { type: addOrder.type, payload: null };
      const state = orderReducer(stateWithOrders, action);

      expect(state.orders).toEqual(mockOrders);
    });
  });

  describe('селекторы', () => {
    const sliceState = {
      orders: mockOrders,
      orderByNumberResponse: mockOrder,
      request: false,
      responseOrder: null,
      error: null,
      orderData: mockOrderApiResponse
    };

    const rootState = {
      order: sliceState,
      burgerConstructor: { bun: null, ingredients: [] },
      ingredients: { items: [], loading: false, error: null },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      user: { user: null, isAuthChecked: false, isLoading: false, error: null }
    };

    it('getOrderState должен вернуть состояние слайса', () => {
      expect(getOrderState(rootState)).toEqual(sliceState);
    });

    it('selectOrderLoading должен вернуть статус загрузки', () => {
      expect(selectOrderLoading(rootState)).toBe(false);
    });

    it('selectOrderError должен вернуть сохраненную ошибку', () => {
      expect(selectOrderError(rootState)).toBeNull();
    });

    it('selectOrderById должен найти заказ по идентификатору', () => {
      const order = selectOrderById(rootState, mockOrder._id);
      expect(order).toEqual(mockOrder);
    });

    it('selectOrderById должен вернуть undefined для несуществующего id', () => {
      const order = selectOrderById(rootState, 'non-existent');
      expect(order).toBeUndefined();
    });

    it('selectOrderByNumber должен найти заказ по номеру', () => {
      const order = selectOrderByNumber(rootState, mockOrder.number);
      expect(order).toEqual(mockOrder);
    });

    it('selectOrderByNumber должен вернуть undefined для несуществующего номера', () => {
      const order = selectOrderByNumber(rootState, 99999);
      expect(order).toBeUndefined();
    });
  });
});
