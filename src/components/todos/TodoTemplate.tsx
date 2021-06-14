import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { ITodo } from '../../utils/types';
import { todoSelectors, create, update } from './todosSlice';

export enum Mode {
  Create = 'create',
  Update = 'update',
}

const submitText = {
  [Mode.Create]: 'Add',
  [Mode.Update]: 'Save',
};

const successMessage = {
  [Mode.Create]: 'Todo was added',
  [Mode.Update]: 'Todo was updated',
};

interface ITodoTemplateProps {
  id?: ITodo['id'];
  title?: ITodo['title'];
  description?: ITodo['description'];
  show: boolean;
  toggle: () => void;
  mode: Mode;
}

export const TodoTemplate: React.FunctionComponent<ITodoTemplateProps> = ({
  id,
  title: titleProp,
  description: descriptionProp,
  show,
  toggle,
  mode,
}: ITodoTemplateProps) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(todoSelectors.selectStatus);

  const [title, setTitle] = useState(titleProp || '');
  const [description, setDescription] = useState(descriptionProp || '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const submitDisabled = (): boolean => {
    const isAnyFieldEmpty = !title || !description;
    if (mode === Mode.Create) {
      return isAnyFieldEmpty;
    }

    const isAnyFieldChanged =
      title !== titleProp || description !== descriptionProp;
    if (mode === Mode.Update) {
      return isAnyFieldEmpty || !isAnyFieldChanged;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === FetchingStatuses.Pending) return;

    if (mode === Mode.Create)
      await handleError(dispatch(create({ title, description })));
    if (mode === Mode.Update && id)
      await handleError(dispatch(update({ id, title, description })));

    if (status === FetchingStatuses.Fulfilled) {
      toast.success(successMessage[mode]);

      if (mode === Mode.Create) {
        setTitle('');
        setDescription('');
      }
      toggle();
    }
  };

  if (!show) return null;

  return (
    <div className="todo todo_template">
      <div>
        <input
          type="text"
          placeholder="Title"
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Description"
          onChange={handleDescriptionChange}
          value={description}
        />
      </div>
      <button type="submit" onClick={handleSubmit} disabled={submitDisabled()}>
        {submitText[mode]}
      </button>
      <button onClick={toggle}>Cancel</button>
    </div>
  );
};
