import { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import store from '../store';

export const ProviderComponent: FC<PropsWithChildren> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);
