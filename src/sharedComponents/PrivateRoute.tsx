import React from 'react';
import { useAppSelector } from '../app/hooks';
import { Redirect, Route } from 'react-router-dom';
import { Roles, routes } from '../utils/constants';

interface IPrivateRouteProps {
  path: string;
  onlyForAdmin?: boolean;
}

export const PrivateRoute: React.FunctionComponent<IPrivateRouteProps> = ({
  children,
  path,
  onlyForAdmin,
}) => {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  if (onlyForAdmin && role === Roles.User) {
    return (
      <Redirect
        to={{
          pathname: routes.root,
        }}
      />
    );
  }

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
