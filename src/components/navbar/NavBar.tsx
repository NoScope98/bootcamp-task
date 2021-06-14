import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses, Roles, routes } from '../../utils/constants';
import { signOut } from '../../auth/authSlice';
import { handleError } from '../../utils/functionWrappers';
import { RootState } from '../../app/store';

export const NavBar = () => {
  const dispatch = useAppDispatch();
  const { status, role, name } = useAppSelector(
    (state: RootState) => state.auth
  );

  const handleLogoutClick = () => {
    if (status === FetchingStatuses.Pending) return;
    handleError(dispatch(signOut()));
  };

  const isAdmin = role === Roles.Admin;

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to={routes.todos}>Todos</Link>
          </li>
          {isAdmin && (
            <li>
              <Link to={routes.users}>Users</Link>
            </li>
          )}
        </ul>
      </nav>
      <div>{name}</div>
      <button onClick={handleLogoutClick}>Logout</button>
    </header>
  );
};
