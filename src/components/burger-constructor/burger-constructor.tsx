import React, { FC, useEffect, useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import {
  getConstructorItems,
  resetConstructor
} from '../../services/slices/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrder,
  createOrder,
  getOrderState
} from '../../services/slices/orderSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = React.memo(() => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const constructorItems = useSelector(getConstructorItems);
  const { orderData, request: orderStateRequest } = useSelector(getOrderState);

  const onOrderClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!constructorItems.bun || orderStateRequest) {
      return;
    }

    const bunId = constructorItems.bun._id;
    const ingredientIds = [
      bunId,
      ...constructorItems.ingredients.map((ing) => ing._id),
      bunId
    ];

    dispatch(createOrder(ingredientIds));
  }, [
    isAuthenticated,
    constructorItems,
    orderStateRequest,
    navigate,
    dispatch
  ]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrder());

    if (orderData && orderData.success) {
      dispatch(resetConstructor());
    }
  }, [dispatch, orderData]);

  const orderModalData = orderData?.order || null;
  const orderRequest = orderStateRequest;

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
});
