import { authorizedRequest } from '../../app/apiConfig';

const resource = '/users';

export const usersApi = {
  getAll: () => authorizedRequest.get(resource),
};
