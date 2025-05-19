import axios from 'axios';

export const baseUrl = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

const baseUrlWithToken = axios.create({
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

const get_notifications = async () => {
  // alert('get_notifications');
  try {
    const response = await baseUrlWithToken.get(`/staff/notification`);

    return response.data;
  } catch (error) {
    console.log('error at get_notifications: ', error);
    return [];
  }
};

const set_read_notification = async (id) => {
  try {
    const response = await baseUrlWithToken.patch(`/staff/notification/${id}`);

    return response.data;
  } catch (error) {
    console.log('error at set_read_notification: ', error);
    throw error.response.data ? error.response.data : { message: 'Internal server error' };
  }
};

const delete_select_notification = async (ids = []) => {
  try {
    if (!ids || ids.length === 0) {
      throw new Error('No IDs provided');
    }
    const response = await baseUrlWithToken.delete(`/staff/notification/${ids?.join(',')}`);

    return response.data;
  } catch (error) {
    console.log('error at delete_select_notification: ', error);
    throw error.response.data ? error.response.data : { message: 'Internal server error' };
  }
};

export { get_notifications, set_read_notification, delete_select_notification };
