import http from './http';

export const loginApi = async (payload) => {
  const { data } = await http.post('/auth/login', payload);
  return data;
};

export const logoutApi = async () => {
  const { data } = await http.post('/auth/logout');
  return data;
};

export const refreshApi = async () => {
  const { data } = await http.post('/auth/refresh');
  return data;
};
