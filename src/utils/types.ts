export interface ITodo {
  id: number;
  title: string;
  description: string;
  createdBy: string;
}

export interface ITodoCreateRequest {
  title: ITodo['title'];
  description: ITodo['description'];
}

export interface ITodoUpdateRequest {
  title: ITodo['title'];
  description: ITodo['description'];
}

export interface IAuthData {
  name: string;
  role: string;
}

export interface ILoginRequest {
  login: string;
  password: string;
}

export interface IErrorResponse {
  code: number;
  message: string;
}
