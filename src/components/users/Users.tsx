import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Roles } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { fetchAll, userSelectors } from './usersSlice';
import './users.scss';
import adminIcon from '../../icons/admin.png';
import userIcon from '../../icons/user.png';

const iconMapping = {
  [Roles.Admin]: <img src={adminIcon} alt="adminIcon" />,
  [Roles.User]: <img src={userIcon} alt="userIcon" />,
};

export const Users: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(userSelectors.selectAll);

  useEffect(() => {
    handleError(dispatch(fetchAll()));
  }, [dispatch]);

  return (
    <article className="users">
      {users.length === 0 && 'There are no available users'}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.name} className="user-info">
            {iconMapping[user.role]}
            {user.name}
          </li>
        ))}
      </ul>
    </article>
  );
};
