import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector((state) => {
    if (!number) return null;
    const orderNumber = parseInt(number, 10);

    return (
      state.order.orders.find((order) => order.number === orderNumber) ||
      (state.order.orderByNumberResponse?.number === orderNumber
        ? state.order.orderByNumberResponse
        : null)
    );
  });

  const ingredients = useSelector((state) => state.ingredients.items);
  const orderLoading = useSelector((state) => state.order.request);
  const ingredientsLoading = useSelector((state) => state.ingredients.loading);

  useEffect(() => {
    if (number && !orderData && !orderLoading) {
      const orderNumber = parseInt(number, 10);
      !isNaN(orderNumber) && dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [number, orderData, orderLoading, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || ingredientsLoading) return null;

    if (ingredients.length === 0) return null;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc, itemId) => {
        const ingredient = ingredients.find((ing) => ing._id === itemId);

        if (ingredient) {
          if (!acc[itemId]) {
            acc[itemId] = { ...ingredient, count: 1 };
          } else {
            acc[itemId].count++;
          }
        }
        return acc;
      },
      {} as Record<string, TIngredient & { count: number }>
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date: new Date(orderData.createdAt),
      total
    };
  }, [orderData, ingredients, ingredientsLoading]);

  if (orderLoading || ingredientsLoading) {
    return <Preloader />;
  }

  if (!orderInfo && !ingredientsLoading) {
    return <div>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo!} />;
};
