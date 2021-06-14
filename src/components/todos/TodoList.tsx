import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { Loader } from '../common/loader/Loader';
import { Todo } from './Todo';
import { fetchAll, todoSelectors } from './todosSlice';
import { Mode, TodoTemplate } from './TodoTemplate';
import './todos.scss';
import { ITodo } from '../../utils/types';

interface ITodoListProps {}

interface IUpdateMode {
  updatedId: ITodo['id'] | null;
  show: boolean;
}

export const TodoList: React.FunctionComponent<ITodoListProps> = (
  props: ITodoListProps
) => {
  const dispatch = useAppDispatch();

  const [isCreating, setIsCreating] = useState(false);
  const [updateMode, setUpdateMode] = useState<IUpdateMode>({
    updatedId: null,
    show: false,
  });

  const todos = useAppSelector(todoSelectors.selectAll);
  const status = useAppSelector(todoSelectors.selectStatus);

  useEffect(() => {
    handleError(dispatch(fetchAll()));
  }, [dispatch]);

  const toggleCreateMode = () => {
    setIsCreating(!isCreating);
  };
  const toggleUpdateMode = useCallback(
    (id: ITodo['id']) => () => {
      console.log(updateMode.show);

      if (updateMode.show) {
        setUpdateMode({ updatedId: null, show: false });
      } else {
        setUpdateMode({ updatedId: id, show: true });
      }
    },
    [updateMode.show]
  );

  const isLoading = status === FetchingStatuses.Pending;

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

  return (
    <div className="todo-list">
      <button onClick={toggleCreateMode} disabled={isCreating}>
        Add todo
      </button>
      <Loader show={isLoading} />

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
