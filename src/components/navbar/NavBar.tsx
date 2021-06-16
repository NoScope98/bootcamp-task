import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses, Roles, routes } from '../../utils/constants';
import { signOut } from '../../auth/authSlice';
import { handleError } from '../../utils/functionWrappers';
import { RootState } from '../../app/store';
import './navBar.scss';

export const NavBar = () => {
  const dispatch = useAppDispatch();
  const {
    status: authStatus,
    role,
    name,
  } = useAppSelector((state: RootState) => state.auth);
  const { status: todosStatus } = useAppSelector(
    (state: RootState) => state.todos
  );
  const { status: usersStatus } = useAppSelector(
    (state: RootState) => state.users
  );

  const isLogoutButtonDisabled =
    todosStatus === FetchingStatuses.Pending ||
    usersStatus === FetchingStatuses.Pending ||
    authStatus === FetchingStatuses.Pending;

  const handleLogoutClick = () => {
    handleError(dispatch(signOut()));
  };

  const isAdmin = role === Roles.Admin;

  return (
    <div className="nav-bar-container">
      <header className="header">
        <nav className="nav">
          <ul className="nav__links">
            <li>
              <NavLink
                className="link"
                activeClassName="link_active"
                to={routes.todos}
              >
                Todos
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink
                  className="link"
                  activeClassName="link_active"
                  to={routes.users}
                >
                  Users
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="logout-block">
          <div className="logout-block__username">{name}</div>
          <button
            className="button logout-block__button"
            onClick={handleLogoutClick}
            disabled={isLogoutButtonDisabled}
          >
            Logout
          </button>
        </div>
      </header>
    </div>
  );
};
