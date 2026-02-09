import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const STATUS_CONFIG = {
  pending: { text: 'Готовится', color: '#E52B1A' },
  done: { text: 'Выполнен', color: '#00CCCC' },
  created: { text: 'Создан', color: '#F2F2F3' }
} as const;

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
    text: status || 'Неизвестно',
    color: '#F2F2F3'
  };

  return <OrderStatusUI textStyle={config.color} text={config.text} />;
};
