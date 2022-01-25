import React, { useState } from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signIn } from '../../auth/authSlice';
import { FetchingStatuses, routes } from '../../utils/constants';
import { RootState } from '../../app/store';
import { handleError } from '../../utils/functionWrappers';
import './loginForm.scss';

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
    <section>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="form__label" htmlFor="login">
          Login:
        </label>
        <div>
          <input
            className="form__input"
            id="login"
            type="text"
            value={login}
            onChange={handleLoginChange}
          />
        </div>
        <label className="form__label" htmlFor="password">
          Password:
        </label>
        <div>
          <input
            className="form__input"
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button
          className="button"
          type="submit"
          value="Sign in"
          disabled={submitDisabled}
        >
          Sign in
        </button>
      </form>
    </section>
  );
};
