import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderApiResponse = {
  success: boolean;
  name: string;
  order: TOrder;
};

type TOrderState = {
  orders: TOrder[];
  orderByNumberResponse: TOrder | null;
  request: boolean;
  responseOrder: null;
  error: string | null;
  orderData: TOrderApiResponse | null;
};

const initialState: TOrderState = {
  orders: [],
  orderByNumberResponse: null,
  request: false,
  responseOrder: null,
  error: null,
  orderData: null
};

// Создание заказа
export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { dispatch, rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка оформления заказа');
    }
  }
);

// Получение заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/byNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка получения заказа');
    }
  }
);

// Загрузка заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки заказов');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: () => initialState,
    resetOrderRequest: (state) => {
      state.request = false;
    },
    addOrder: (state, action) => {
      if (action.payload) {
        // Ограничение истории заказов 50 последними записями
        state.orders = [action.payload, ...state.orders].slice(0, 50);
      }
    }
  },
  selectors: {
    getOrderState: (state: TOrderState) => state,
    selectOrderById: createSelector(
      [
        (state: TOrderState) => state.orders,
        (state: TOrderState, id: string) => id
      ],
      (orders: TOrder[], id: string) => orders.find((order) => order._id === id)
    ),

    selectOrderByNumber: createSelector(
      [
        (state: TOrderState) => state.orders,
        (state: TOrderState, number: number) => number
      ],
      (orders: TOrder[], number: number) =>
        orders.find((order) => order.number === number)
    ),

    selectOrderLoading: (state: TOrderState) => state.request,
    selectOrderError: (state: TOrderState) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.request = false;
        state.error = null;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.request = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.request = false;
        state.error = null;

        if (action.payload && action.payload.length > 0) {
          const existingOrders = state.orders || [];
          const newOrders = action.payload || [];

          const allOrders = [...existingOrders, ...newOrders].reduce(
            (unique, order) => {
              if (!unique.some((o) => o._id === order._id)) {
                unique.push(order);
              }
              return unique;
            },
            [] as TOrder[]
          );

          allOrders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          state.orders = allOrders.slice(0, 50);
        }
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.request = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
        state.request = true;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error = action.payload as string;
        state.request = false;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.error = null;
        state.request = false;
        state.orderByNumberResponse = action.payload.orders[0] || null;
      });
  }
});

export const {
  getOrderState,
  selectOrderById,
  selectOrderByNumber,
  selectOrderLoading,
  selectOrderError
} = orderSlice.selectors;

export const { clearOrder, resetOrderRequest, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
