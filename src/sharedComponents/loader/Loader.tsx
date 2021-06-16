import React from 'react';
import FadeLoader from 'react-spinners/FadeLoader';
import './loader.scss';

interface ILoaderProps {
  show: boolean;
  message?: string;
}

export const Loader: React.FunctionComponent<ILoaderProps> = ({
  show,
  message,
}) => {
  if (!show) return null;

  return (
    <div className="loader">
      <div className="loader__content">
        <FadeLoader height={20} width={5} />
        {message || 'Loading...'}
      </div>
    </div>
  );
};
