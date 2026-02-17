import { TIngredient } from '@utils-types';

export const mockBun: TIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'test.jpg',
  image_mobile: 'test-mobile.jpg',
  image_large: 'test-large.jpg'
};

export const mockMain: TIngredient = {
  _id: '2',
  name: 'Мясо бессмертных моллюсков',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'test.jpg',
  image_mobile: 'test-mobile.jpg',
  image_large: 'test-large.jpg'
};

export const mockSauce: TIngredient = {
  _id: '3',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'test.jpg',
  image_mobile: 'test-mobile.jpg',
  image_large: 'test-large.jpg'
};

export const mockIngredients: TIngredient[] = [mockBun, mockMain, mockSauce];
