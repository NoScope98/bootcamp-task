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

export const App = () => {
  const dispatch = useAppDispatch();

  const { name, role, isAuthenticated, status } = useAppSelector(
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

        {isAuthenticated && (
          <>
            <NavBar />
            <div>name: {name}</div>
            <div>role: {role}</div>
            <hr />
          </>
        )}
        <main className="content">
          <Switch>
            <Route path={routes.login}>
              <LoginForm />
            </Route>
            <PrivateRoute path={routes.todos}>
              <TodoList />
            </PrivateRoute>
            <PrivateRoute path={routes.users}>
              <div>Users</div>
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
