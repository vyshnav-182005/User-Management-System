import http from './http';

export const getProfileApi = async () => {
  const { data } = await http.get('/users/me');
  return data;
};

export const updateProfileApi = async (payload) => {
  const { data } = await http.patch('/users/me', payload);
  return data;
};

export const listUsersApi = async (params) => {
  const normalizedParams = Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== '' && value !== undefined)
  );

  const { data } = await http.get('/users', { params: normalizedParams });
  return data;
};

export const createUserApi = async (payload) => {
  const { data } = await http.post('/users', payload);
  return data;
};

export const updateUserApi = async (id, payload) => {
  const { data } = await http.patch(`/users/${id}`, payload);
  return data;
};

export const deleteUserApi = async (id) => {
  await http.delete(`/users/${id}`);
};
