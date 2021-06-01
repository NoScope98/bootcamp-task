import axios from 'axios';

const config = {
  baseURL: 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
};

const request = axios.create(config);
const authorizedRequest = axios.create({ ...config, withCredentials: true });

const handleError = (error: any) => {
  console.log('error: ' + error);
  return Promise.reject(error);
};

authorizedRequest.interceptors.request.use(async (config) => {
  try {
    await request.get('/me', { withCredentials: true });
    return config;
  } catch (error) {
    return handleError(error);
  }
}, handleError);

authorizedRequest.interceptors.response.use(
  (response) => response,
  handleError
);

export { request, authorizedRequest };
