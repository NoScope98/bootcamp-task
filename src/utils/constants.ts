export const routes = {
  root: '/' as const,
  login: '/login' as const,
  users: '/users' as const,
  todos: '/todos' as const,
};

export enum FetchingStatuses {
  Pending = 'pending',
  Rejected = 'rejected',
  Fulfilled = 'fulfilled',
  Idle = 'idle',
}

export enum Roles {
  Admin = 'admin',
  User = 'user',
}
