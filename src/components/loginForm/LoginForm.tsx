import React, { useState } from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signIn } from '../../auth/authSlice';
import { FetchingStatuses, routes } from '../../utils/constants';
import { RootState } from '../../app/store';
import { handleError } from '../../utils/functionWrappers';

interface LocationState {
  from: {
    pathname: string;
  };
}

export const LoginForm = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const dispatch = useAppDispatch();

  const { isAuthenticated, status } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const submitDisabled = !login || !password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === FetchingStatuses.Pending) return;

    await handleError(dispatch(signIn({ login, password })));

    if (status === FetchingStatuses.Fulfilled) {
      const from = location.state.from || { pathname: routes.root };
      history.replace(from);
    }
  };

  if (isAuthenticated) {
    return <Redirect to={routes.root} />;
  }

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Login:</label>
        <div>
          <input
            id="login"
            type="text"
            value={login}
            onChange={handleLoginChange}
          />
        </div>
        <label htmlFor="password">Password:</label>
        <div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <input type="submit" value="Sign in" disabled={submitDisabled} />
      </form>
    </div>
  );
};
