import { authorizedRequest } from '../../app/apiConfig';
import {
  ITodo,
  ITodoCreateRequest,
  ITodoUpdateRequest,
} from '../../utils/types';

const resource = '/todos';

export const todosApi = {
  getAll: () => authorizedRequest.get(resource),
  create: (data: ITodoCreateRequest) => authorizedRequest.post(resource, data),
  getById: (id: ITodo['id']) => authorizedRequest.get(`${resource}/${id}`),
  update: (id: ITodo['id'], data: ITodoUpdateRequest) =>
    authorizedRequest.put(`${resource}/${id}`, data),
  delete: (id: ITodo['id']) => authorizedRequest.delete(`${resource}/${id}`),
};
