import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { Loader } from '../common/loader/Loader';
import { Todo } from './Todo';
import { fetchAll, todoSelectors } from './todosSlice';
import { TodoTemplate } from './TodoTemplate';
import './todos.scss';

interface ITodoListProps {}

export const TodoList: React.FunctionComponent<ITodoListProps> = (
  props: ITodoListProps
) => {
  const dispatch = useAppDispatch();

  const [isCreating, setIsCreating] = useState(false);

  const todos = useAppSelector(todoSelectors.selectAll);
  const status = useAppSelector(todoSelectors.selectStatus);

  useEffect(() => {
    handleError(dispatch(fetchAll()));
  }, [dispatch]);

  const toggleCreateMode = () => {
    setIsCreating(!isCreating);
  };

  const isLoading = status === FetchingStatuses.Pending;

  const todoList = React.useMemo(() => {
    return todos.map((todo) => (
      <Todo
        key={todo.id}
        title={todo.title}
        description={todo.description}
        createdBy={todo.createdBy}
      />
    ));
  }, [todos]);

  return (
    <>
      <button onClick={toggleCreateMode} disabled={isCreating}>
        Add todo
      </button>
      <div className="todo-list">
        <Loader show={isLoading} />

        {todos.length === 0 && 'There are no todos'}

        <TodoTemplate show={isCreating} toggle={toggleCreateMode} />

        {todoList}
      </div>
    </>
  );
};
