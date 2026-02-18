import { TUser } from '@utils-types';

export const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

export const mockLocalStorage = () => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage() });
