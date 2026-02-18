import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor
} from './constructorSlice';
import { mockBun, mockMain, mockSauce } from './__mocks__/ingredients.mock';
import { TConstructorIngredient } from '@utils-types';

describe('burgerConstructor слайс', () => {
  const initialState = {
    bun: null,
    ingredients: [] as TConstructorIngredient[]
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addIngredient', () => {
    it('должен добавить булку и заменить существующую', () => {
      const firstState = constructorReducer(
        initialState,
        addIngredient(mockBun)
      );

      expect(firstState.bun).not.toBeNull();
      expect(firstState.bun?._id).toBe(mockBun._id);
      expect(firstState.bun).toHaveProperty('id');

      const firstBunId = (firstState.bun as TConstructorIngredient).id;

      const secondState = constructorReducer(
        firstState,
        addIngredient(mockBun)
      );

      expect(secondState.bun).not.toBeNull();
      expect(secondState.bun?._id).toBe(mockBun._id);

      const secondBunId = (secondState.bun as TConstructorIngredient).id;
      expect(secondBunId).not.toBe(firstBunId);
    });

    it('должен добавить начинку в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockMain));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(state.ingredients[0]).toHaveProperty('id');
    });

    it('должен добавить несколько начинок в конструктор', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(state.ingredients[1]._id).toBe(mockSauce._id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить начинку по идентификатору', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      const idToRemove = state.ingredients[0].id;
      state = constructorReducer(state, removeIngredient(idToRemove));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
    });

    it('не должен удалить начинку если идентификатор не найден', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      const beforeLength = state.ingredients.length;

      state = constructorReducer(state, removeIngredient('non-existent-id'));

      expect(state.ingredients).toHaveLength(beforeLength);
    });
  });

  describe('moveIngredientUp', () => {
    it('должен переместить ингредиент на позицию выше', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain));

      const beforeIds = state.ingredients.map((item) => item.id);

      state = constructorReducer(state, moveIngredientUp(1));

      const afterIds = state.ingredients.map((item) => item.id);

      expect(afterIds[0]).toBe(beforeIds[1]);
      expect(afterIds[1]).toBe(beforeIds[0]);
      expect(afterIds[2]).toBe(beforeIds[2]);
    });

    it('не должен переместить первый ингредиент вверх', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      const beforeIds = state.ingredients.map((item) => item.id);
      state = constructorReducer(state, moveIngredientUp(0));

      const afterIds = state.ingredients.map((item) => item.id);
      expect(afterIds).toEqual(beforeIds);
    });
  });

  describe('moveIngredientDown', () => {
    it('должен переместить ингредиент на позицию ниже', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain));

      const beforeIds = state.ingredients.map((item) => item.id);

      state = constructorReducer(state, moveIngredientDown(0));

      const afterIds = state.ingredients.map((item) => item.id);

      expect(afterIds[0]).toBe(beforeIds[1]);
      expect(afterIds[1]).toBe(beforeIds[0]);
      expect(afterIds[2]).toBe(beforeIds[2]);
    });

    it('не должен переместить последний ингредиент вниз', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      const lastIndex = state.ingredients.length - 1;
      const beforeIds = state.ingredients.map((item) => item.id);

      state = constructorReducer(state, moveIngredientDown(lastIndex));

      const afterIds = state.ingredients.map((item) => item.id);
      expect(afterIds).toEqual(beforeIds);
    });
  });

  describe('resetConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients.length).toBeGreaterThan(0);

      state = constructorReducer(state, resetConstructor());

      expect(state).toEqual(initialState);
    });
  });
});
