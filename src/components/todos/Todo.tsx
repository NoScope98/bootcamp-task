import React from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { EditIcon } from '../../icons/EditIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { FetchingStatuses, Roles } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { ITodo } from '../../utils/types';
import { remove, todoSelectors } from './todosSlice';

interface ITodoProps extends ITodo {
  updateButtonDisabled: boolean;
  onUpdateClick: () => void;
}

export const Todo: React.FunctionComponent<ITodoProps> = ({
  id,
  title,
  description,
  createdBy,
  updateButtonDisabled,
  onUpdateClick,
}) => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(todoSelectors.selectStatus);
  const { role } = useAppSelector((state: RootState) => state.auth);

  const showControls = role === Roles.Admin || role === createdBy;

  const handleDeleteTodoClick = async () => {
    if (status === FetchingStatuses.Pending) return;

    await handleError(dispatch(remove({ id })));

    if (status === FetchingStatuses.Fulfilled) {
      toast.success('Todo was deleted');
    }
  };

  return (
    <div className="todo">
      <div className="todo__header">{title}</div>
      <div className="todo__content">{description}</div>
      <div className="todo__footer">
        {createdBy}
        {showControls && (
          <div>
            <button
              onClick={onUpdateClick}
              disabled={updateButtonDisabled}
              className="todo__control"
            >
              <EditIcon />
            </button>
            <button onClick={handleDeleteTodoClick} className="todo__control">
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
