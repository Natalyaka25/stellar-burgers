import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

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

  useEffect(() => {
    if (ingredients.length === 0 && !ingredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, ingredientsLoading]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc, itemId) => {
        if (!acc[itemId]) {
          const ingredient = ingredients.find((ing) => ing._id === itemId);
          ingredient && (acc[itemId] = { ...ingredient, count: 1 });
        } else {
          acc[itemId].count++;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: any) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date: new Date(orderData.createdAt),
      total
    };
  }, [orderData, ingredients]);

  if (orderLoading || ingredientsLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
