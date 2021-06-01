import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Redirect, Route } from 'react-router-dom';
import { routes } from '../../utils/constants';

interface IPrivateRouteProps {
  path: string;
}

export const PrivateRoute: React.FunctionComponent<IPrivateRouteProps> = ({
  children,
  path,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Route
      path={path}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: routes.login,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
