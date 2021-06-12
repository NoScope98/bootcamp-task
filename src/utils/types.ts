export interface ITodo {
  id: number;
  title: string;
  description: string;
  createdBy: string;
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
