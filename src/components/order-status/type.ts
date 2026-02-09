export type TOrderStatus = 'pending' | 'done' | 'created';

export interface OrderStatusProps {
  status: TOrderStatus | string;
}

export interface OrderStatusUIProps {
  textStyle: string;
  text: string;
}
