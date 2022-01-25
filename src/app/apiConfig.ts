import axios from 'axios';

const config = {
  baseURL: 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

const request = axios.create(config);

request.interceptors.response.use(
  (response) => response,
  (error: any) => {
    console.log('error: ' + error);
    return Promise.reject(error);
  }
);

export { request };
