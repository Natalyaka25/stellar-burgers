import { TOrder } from '@utils-types';

export const mockOrder: TOrder = {
  _id: 'ORDER123',
  number: 12345,
  name: 'Краторный бургер',
  status: 'done',
  createdAt: '2024-01-01T12:00:00Z',
  updatedAt: '2024-01-01T12:05:00Z',
  ingredients: ['1', '2', '3', '4']
};

export const mockOrders: TOrder[] = [
  mockOrder,
  {
    _id: 'ORDER456',
    number: 12346,
    name: 'Люминесцентный бургер',
    status: 'pending',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
    ingredients: ['5', '6', '7']
  },
  {
    _id: 'ORDER789',
    number: 12347,
    name: 'Фалленианский бургер',
    status: 'done',
    createdAt: '2024-01-03T15:30:00Z',
    updatedAt: '2024-01-03T15:35:00Z',
    ingredients: ['8', '9', '10', '11', '12']
  }
];

export const mockOrderApiResponse = {
  success: true,
  name: 'Краторный бургер',
  order: mockOrder
};

export const mockOrderByNumberResponse = {
  success: true,
  orders: [mockOrder]
};

export const mockIngredientIds = ['1', '2', '3', '4'];
