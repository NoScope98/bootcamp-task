import { request } from '../app/apiConfig';
import { ILoginRequest } from '../utils/types';

export const authApi = {
  login: (data: ILoginRequest) => request.post('/login', data),
  logout: () => request.post('/logout'),
  me: () => request.get('/me'),
};
