import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { todoSelectors, create } from './todosSlice';

interface ITodoTemplateProps {
  show: boolean;
  toggle: () => void;
}

export const TodoTemplate: React.FunctionComponent<ITodoTemplateProps> = ({
  show,
  toggle,
}: ITodoTemplateProps) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(todoSelectors.selectStatus);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const submitDisabled = !title || !description;

  const handleAddTodoClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === FetchingStatuses.Pending) return;

    await handleError(dispatch(create({ title, description })));

    if (status === FetchingStatuses.Fulfilled) {
      toast.success('Todo was added');
      toggle();
    }
  };

  if (!show) return null;

  return (
    <div className="todo todo_template">
      <div>
        <input type="text" placeholder="Title" onChange={handleTitleChange} />
      </div>
      <div>
        <input
          type="text"
          placeholder="Description"
          onChange={handleDescriptionChange}
        />
      </div>
      <button
        type="submit"
        onClick={handleAddTodoClick}
        disabled={submitDisabled}
      >
        Add
      </button>
      <button onClick={toggle}>Cancel</button>
    </div>
  );
};
