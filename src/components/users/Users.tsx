import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { Loader } from '../common/loader/Loader';
import { fetchAll, userSelectors } from './usersSlice';

export const Users: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(userSelectors.selectAll);
  const status = useAppSelector(userSelectors.selectStatus);

  useEffect(() => {
    handleError(dispatch(fetchAll()));
  }, [dispatch]);

  const isLoading = status === FetchingStatuses.Pending;

  return (
    <ul>
      <Loader show={isLoading} />
      {users.length === 0 && 'There are no available users'}
      {users.map((user) => (
        <li key={user.name}>{`${user.name} (${user.role})`}</li>
      ))}
    </ul>
  );
};
