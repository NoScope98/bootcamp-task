import { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { NavBar } from './modules/navbar/NavBar';
import { TodoList } from './modules/todos/TodoList';
import { FetchingStatuses, routes } from './utils/constants';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { LoginForm } from './modules/loginForm/LoginForm';
import { PrivateRoute } from './sharedComponents/PrivateRoute';
import { Loader } from './sharedComponents/loader/Loader';
import { checkAuthorization } from './auth/authSlice';
import { RootState } from './app/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { handleError } from './utils/functionWrappers';
import { Users } from './modules/users/Users';

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
        <div className="container">
          <main className="main-content">
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
        </div>

        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </>
  );
};
