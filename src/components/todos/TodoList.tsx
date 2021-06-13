import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchingStatuses } from '../../utils/constants';
import { handleError } from '../../utils/functionWrappers';
import { Loader } from '../common/loader/Loader';
import { Todo } from './Todo';
import { fetchAll, todoSelectors } from './todosSlice';

interface ITodoListProps {}

export const TodoList: React.FunctionComponent<ITodoListProps> = (
  props: ITodoListProps
) => {
  const dispatch = useAppDispatch();

  const todos = useAppSelector(todoSelectors.selectAll);
  const status = useAppSelector(todoSelectors.selectStatus);

  useEffect(() => {
    handleError(dispatch(fetchAll()));
  }, [dispatch]);

  const isLoading = status === FetchingStatuses.Pending;

  return (
    <div className="todo-list">
      <Loader show={isLoading} />
      {todos.length === 0 && 'There are no todos'}
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          title={todo.title}
          description={todo.description}
          createdBy={todo.createdBy}
        ></Todo>
      ))}
    </div>
  );
};
