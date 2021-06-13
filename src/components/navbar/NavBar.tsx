import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses, routes } from '../../utils/constants';
import { signOut } from '../../auth/authSlice';
import { handleError } from '../../utils/functionWrappers';
import { RootState } from '../../app/store';

export const NavBar = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state: RootState) => state.auth);

  const handleLogoutClick = () => {
    if (status === FetchingStatuses.Pending) return;
    handleError(dispatch(signOut()));
  };

  return (
    <header>
      <nav style={{ border: '1px solid black' }}>
        <ul>
          <li>
            <Link to={routes.todos}>Todos</Link>
          </li>
          <li>
            <Link to={routes.users}>Users</Link>
          </li>
        </ul>
      </nav>
      <button onClick={handleLogoutClick}>Logout</button>
    </header>
  );
};
