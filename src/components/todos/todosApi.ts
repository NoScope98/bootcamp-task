import { authorizedRequest } from '../../app/apiConfig';

const resource = '/todos';

export const todosApi = {
  getAll: () => authorizedRequest.get(resource),
};
