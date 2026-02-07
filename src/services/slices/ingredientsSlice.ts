// services/slices/ingredientsSlice.ts
import { getIngredientsApi } from '@api';
import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки ингредиентов');
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredientsLoading: (state) => state.loading,
    selectIngredients: (state) => state.items,

    selectIngredientById: createSelector(
      [(state: IngredientsState) => state.items, (state, id: string) => id],
      (items: TIngredient[], id: string) =>
        items.find((item: TIngredient) => item._id === id)
    ),

    selectBuns: createSelector(
      [(state: IngredientsState) => state.items],
      (items: TIngredient[]) =>
        items.filter((item: TIngredient) => item.type === 'bun')
    ),
    selectMains: createSelector(
      [(state: IngredientsState) => state.items],
      (items: TIngredient[]) =>
        items.filter((item: TIngredient) => item.type === 'main')
    ),
    selectSauces: createSelector(
      [(state: IngredientsState) => state.items],
      (items: TIngredient[]) =>
        items.filter((item: TIngredient) => item.type === 'sauce')
    )
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || 'Ошибка при получении ингредиентов';
      });
  }
});

export const {
  selectIngredientsLoading,
  selectIngredientById,
  selectIngredients,
  selectBuns,
  selectMains,
  selectSauces
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
