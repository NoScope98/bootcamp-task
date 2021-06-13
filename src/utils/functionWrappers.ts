import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const handleError = (invokedDispatch: any) => {
  return invokedDispatch.then(unwrapResult).catch((err: any) => {
    if (err.status === 401) {
      toast.info("You're not authenticated, please login");
    } else if (err.status === 403) {
      toast.info("You're not authorized, please login");
    } else {
      toast.error('Something went wrong, please try again');
    }
  });
};
