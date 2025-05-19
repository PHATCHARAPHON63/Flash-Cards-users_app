import axios from 'axios';

export const baseUrlWithToken = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});
// make sure to include the token in the headers
baseUrlWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    } else {
      throw new Error('No token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const post_agenda = async (data) => {
  try {
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/agenda/post_agenda`, data);
    return response.data;
  } catch (err) {
    throw new Error(err?.response?.data.message || 'บันทึกไม่สําเร็จ');
  }
};

export const get_agenda = async () => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/agenda/get_agenda`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const add_agenda = async (id, data) => {
  try {
    console.log(data);
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/agenda/add_agenda/${id}`, data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const get_agenda_view = async (id) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/agenda/get_agenda_view/${id}`);
    return response.data.at(-1);
  } catch (err) {
    throw err;
  }
};

export const edit_agenda = async (id, data) => {
  try {
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/agenda/edit_agenda/${id}`, data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const delete_agenda = async (id, data) => {
  try {
    console.log(id);
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/agenda/delete_agenda/${id}`, data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const get_agenda_key_check = async () => {
  try {
    const response = await baseUrlWithToken.get(`/staff/agenda/agenda_key_check`);
    console.log('get_agenda_key_check', response.data);

    return response.data;
  } catch (err) {
    throw err;
  }
};
