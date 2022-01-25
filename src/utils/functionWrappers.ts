import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { IError } from './types';

export const handleError = (invokedDispatch: Promise<any>) => {
  return invokedDispatch.then(unwrapResult).catch((err: IError) => {
    if (err?.name === 'ConditionError') {
      return;
    }

    if (err.status === 401) {
      toast.info("You're not authenticated, please login");
    } else if (err.status === 403) {
      toast.info("You're not authorized");
    } else {
      const message = err.message || 'Something went wrong, please try again';
      toast.error(message);
    }
  });
};
