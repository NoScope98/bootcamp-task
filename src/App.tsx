import { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { NavBar } from './components/navbar/NavBar';
import { TodoList } from './components/todos/TodoList';
import { FetchingStatuses, routes } from './utils/constants';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { LoginForm } from './components/loginForm/LoginForm';
import { PrivateRoute } from './components/common/PrivateRoute';
import { Loader } from './components/common/loader/Loader';
import { checkAuthorization } from './auth/authSlice';
import { RootState } from './app/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { handleError } from './utils/functionWrappers';
import { Users } from './components/users/Users';

export const App = () => {
  const dispatch = useAppDispatch();

  const { isAuthenticated, status } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    handleError(dispatch(checkAuthorization()));
  }, [dispatch]);

  const isLoading = status === FetchingStatuses.Pending;

  return (
    <>
      <BrowserRouter>
        <Loader show={isLoading} />

        {isAuthenticated && <NavBar />}
        <main className="content">
          <Switch>
            <Route path={routes.login}>
              <LoginForm />
            </Route>
            <PrivateRoute path={routes.todos}>
              <TodoList />
            </PrivateRoute>
            <PrivateRoute onlyForAdmin path={routes.users}>
              <Users />
            </PrivateRoute>
            <PrivateRoute path={routes.root}>
              <Redirect to={routes.todos} />
            </PrivateRoute>
          </Switch>
        </main>

        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </>
  );
};
