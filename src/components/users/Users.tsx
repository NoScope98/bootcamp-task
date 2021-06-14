import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses, Roles } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { Loader } from '../common/loader/Loader';
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
  const status = useAppSelector(userSelectors.selectStatus);

  useEffect(() => {
    handleError(dispatch(fetchAll()));
  }, [dispatch]);

  const isLoading = status === FetchingStatuses.Pending;

  return (
    <article className="users">
      <Loader show={isLoading} />
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
