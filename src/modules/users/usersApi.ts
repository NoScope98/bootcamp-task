import { request } from '../../app/apiConfig';

const resource = '/users';

export const usersApi = {
  getAll: () => request.get(resource),
};
