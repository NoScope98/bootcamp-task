import React from 'react';

interface ITodoProps {
  title: string;
  description: string;
  createdBy: string;
}

export const Todo: React.FunctionComponent<ITodoProps> = ({
  title,
  description,
  createdBy,
}: ITodoProps) => {
  return (
    <div className="todo">
      <div>{title}</div>
      <div>{description}</div>
      <div>{createdBy}</div>
    </div>
  );
};
