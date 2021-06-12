import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { routes } from '../../utils/constants';
import { signOut } from '../../auth/authSlice';

export const NavBar = () => {
  const dispatch = useAppDispatch();

  const handleLogoutClick = () => {
    dispatch(signOut());
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
