import { TOrder } from '@utils-types';

export const mockOrders: TOrder[] = [
  {
    _id: '1',
    number: 12345,
    name: 'Краторный бургер',
    status: 'done',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
    ingredients: ['1', '2', '3']
  },
  {
    _id: '2',
    number: 12346,
    name: 'Люминесцентный бургер',
    status: 'pending',
    createdAt: '2024-01-01T13:00:00Z',
    updatedAt: '2024-01-01T13:00:00Z',
    ingredients: ['4', '5', '6']
  },
  {
    _id: '3',
    number: 12347,
    name: 'Фалленианский бургер',
    status: 'done',
    createdAt: '2024-01-01T14:00:00Z',
    updatedAt: '2024-01-01T14:00:00Z',
    ingredients: ['7', '8', '9']
  }
];

export const mockFeedResponse = {
  success: true,
  orders: mockOrders,
  total: 150,
  totalToday: 15
};
