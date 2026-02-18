import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен содержать все необходимые слайсы', () => {
    const state = rootReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(Object.keys(state)).toHaveLength(5);
  });

  it('должен возвращать тот же state при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    const nextState = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });

    expect(nextState).toEqual(initialState);
  });
});
