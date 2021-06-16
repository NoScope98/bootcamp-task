import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { handleError } from '../../utils/functionWrappers';
import { Todo } from './Todo';
import { fetchAll, todoSelectors } from './todosSlice';
import { Mode, TodoTemplate } from './TodoTemplate';
import './todos.scss';
import { ITodo } from '../../utils/types';
import { RootState } from '../../app/store';
import { FetchingStatuses } from '../../utils/constants';
import { Loader } from '../../sharedComponents/loader/Loader';

interface IUpdateMode {
  updatedId: ITodo['id'] | null;
  show: boolean;
}

export const TodoList: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const [isCreating, setIsCreating] = useState(false);
  const [updateMode, setUpdateMode] = useState<IUpdateMode>({
    updatedId: null,
    show: false,
  });

  const todos = useAppSelector(todoSelectors.selectAll);
  const { status } = useAppSelector((state: RootState) => state.todos);

  useEffect(() => {
    handleError(dispatch(fetchAll()));
  }, [dispatch]);

  const toggleCreateMode = () => {
    setIsCreating(!isCreating);
  };
  const toggleUpdateMode = useCallback(
    (id: ITodo['id']) => () => {
      if (updateMode.show) {
        setUpdateMode({ updatedId: null, show: false });
      } else {
        setUpdateMode({ updatedId: id, show: true });
      }
    },
    [updateMode.show]
  );

  const todoList = React.useMemo(() => {
    return todos.map((todo) =>
      updateMode.updatedId === todo.id ? (
        <TodoTemplate
          key={todo.id}
          id={todo.id}
          title={todo.title}
          description={todo.description}
          show={updateMode.show}
          toggle={toggleUpdateMode(todo.id)}
          mode={Mode.Update}
        />
      ) : (
        <Todo
          key={todo.id}
          id={todo.id}
          title={todo.title}
          description={todo.description}
          createdBy={todo.createdBy}
          onUpdateClick={toggleUpdateMode(todo.id)}
          updateButtonDisabled={updateMode.show}
        />
      )
    );
  }, [todos, toggleUpdateMode, updateMode]);

  const isLoading = status === FetchingStatuses.Pending;

  return (
    <div className="todo-list">
      <Loader show={isLoading} />
      <button
        className="button"
        onClick={toggleCreateMode}
        disabled={isCreating}
      >
        Add todo
      </button>

      {todos.length === 0 && 'There are no todos'}

      <TodoTemplate
        show={isCreating}
        toggle={toggleCreateMode}
        mode={Mode.Create}
      />

      {todoList}
    </div>
  );
};
