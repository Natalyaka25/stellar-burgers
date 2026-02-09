import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';

interface IProtectedRouteProps {
  children: ReactElement;
  onlyUnAuth?: boolean;
}

const ProtectedRoute: FC<IProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <div>Проверка авторизации...</div>;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
