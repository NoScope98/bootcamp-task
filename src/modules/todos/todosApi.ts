import { request } from '../../app/apiConfig';
import {
  ITodo,
  ITodoCreateRequest,
  ITodoUpdateRequest,
} from '../../utils/types';

const resource = '/todos';

export const todosApi = {
  getAll: () => request.get(resource),
  create: (data: ITodoCreateRequest) => request.post(resource, data),
  getById: (id: ITodo['id']) => request.get(`${resource}/${id}`),
  update: (id: ITodo['id'], data: ITodoUpdateRequest) =>
    request.put(`${resource}/${id}`, data),
  delete: (id: ITodo['id']) => request.delete(`${resource}/${id}`),
};
