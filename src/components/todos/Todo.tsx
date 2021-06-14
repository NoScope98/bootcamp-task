import React from 'react';
import { toast } from 'react-toastify';
import { AppDispatch } from '../../app/store';
import { FetchingStatuses, Roles } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { ITodo } from '../../utils/types';
import { remove } from './todosSlice';

interface ITodoProps extends ITodo {
  role: Roles;
  status: FetchingStatuses;
  dispatch: AppDispatch;
}

export const Todo: React.FunctionComponent<ITodoProps> = ({
  id,
  title,
  description,
  createdBy,
  role,
  status,
  dispatch,
}: ITodoProps) => {
  const showDeleteButton = role === Roles.Admin || role === createdBy;

  const handleDeleteTodoClick = async () => {
    if (status === FetchingStatuses.Pending) return;

    await handleError(dispatch(remove({ id })));

    if (status === FetchingStatuses.Fulfilled) {
      toast.success('Todo was deleted');
    }
  };

  return (
    <div className="todo">
      <div>{title}</div>
      <div>{description}</div>
      <div>{createdBy}</div>
      {showDeleteButton && (
        <button onClick={handleDeleteTodoClick}>Delete todo</button>
      )}
    </div>
  );
};
