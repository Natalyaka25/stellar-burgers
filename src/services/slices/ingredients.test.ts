import ingredientsReducer, {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectBuns,
  selectMains,
  selectSauces,
  selectIngredientById
} from './ingredientsSlice';
import {
  mockIngredients,
  mockBun,
  mockMain,
  mockSauce
} from './__mocks__/ingredients.mock';

describe('ingredients слайс', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients', () => {
    it('должен установить статус загрузки при получении ингредиентов', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.items).toEqual([]);
    });

    it('должен сохранить ингредиенты при успешном получении', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockIngredients);
    });

    it('должен сохранить ошибку при неудачном получении ингредиентов', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    it('должен использовать сообщение об ошибке по умолчанию если данные отсутствуют', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: undefined
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка при получении ингредиентов');
      expect(state.items).toEqual([]);
    });
  });

  describe('селекторы', () => {
    const sliceState = {
      items: mockIngredients,
      loading: false,
      error: null
    };

    const rootState = {
      ingredients: sliceState,
      burgerConstructor: { bun: null, ingredients: [] },
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
      },
      user: { user: null, isAuthChecked: false, isLoading: false, error: null }
    };

    it('selectIngredients должен вернуть все ингредиенты', () => {
      expect(selectIngredients(rootState)).toEqual(mockIngredients);
    });

    it('selectIngredientsLoading должен вернуть статус загрузки', () => {
      expect(selectIngredientsLoading(rootState)).toBe(false);
    });

    it('selectBuns должен вернуть только булки', () => {
      const buns = selectBuns(rootState);
      expect(buns).toHaveLength(1);
      expect(buns[0]).toEqual(mockBun);
    });

    it('selectMains должен вернуть только начинки', () => {
      const mains = selectMains(rootState);
      expect(mains).toHaveLength(1);
      expect(mains[0]).toEqual(mockMain);
    });

    it('selectSauces должен вернуть только соусы', () => {
      const sauces = selectSauces(rootState);
      expect(sauces).toHaveLength(1);
      expect(sauces[0]).toEqual(mockSauce);
    });

    it('selectIngredientById должен найти ингредиент по идентификатору', () => {
      const ingredient = selectIngredientById(rootState, mockMain._id);
      expect(ingredient).toEqual(mockMain);
    });

    it('selectIngredientById должен вернуть undefined для несуществующего id', () => {
      const ingredient = selectIngredientById(rootState, '999');
      expect(ingredient).toBeUndefined();
    });
  });
});
