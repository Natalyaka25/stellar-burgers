import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки ленты заказов';
      return rejectWithValue(message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeeds: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.orders = action.payload.orders || [];
          state.total = action.payload.total || 0;
          state.totalToday = action.payload.totalToday || 0;
        } else {
          state.error = 'Неверный формат данных';
        }
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearFeeds } = feedSlice.actions;
export default feedSlice.reducer;

export const selectFeed = (state: { feed: TFeedState }) => state.feed;
export const selectOrders = (state: { feed: TFeedState }) => state.feed.orders;
export const selectLoading = (state: { feed: TFeedState }) =>
  state.feed.loading;
