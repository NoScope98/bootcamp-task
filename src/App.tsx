import { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { NavBar } from './components/navbar/NavBar';
// import { TodoList } from './components/todos/TodoList';
import { routes } from './utils/constants';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { LoginForm } from './components/auth/LoginForm';
import { PrivateRoute } from './components/common/PrivateRoute';
import { checkAuthorization } from './components/auth/authSlice';
import { RootState } from './app/store';

export const App = () => {
  const dispatch = useAppDispatch();

  const { name, role, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuthorization());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BrowserRouter>
        {isAuthenticated && (
          <>
            <NavBar />
            <div>name: {name}</div>
            <div>role: {role}</div>
            <hr />
          </>
        )}
        <main>
          <Switch>
            <Route path={routes.login}>
              <LoginForm />
            </Route>
            <PrivateRoute path={routes.todos}>
              <div>Todos</div>
            </PrivateRoute>
            <PrivateRoute path={routes.users}>
              <div>Users</div>
            </PrivateRoute>
            <PrivateRoute path={routes.root}>
              <Redirect to={routes.todos} />
            </PrivateRoute>
          </Switch>
        </main>
      </BrowserRouter>
    </>
  );
};
