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

const getNotificationStudent = async () => {
  // alert('getNotificationStudent');
  try {
    const response = await baseUrlWithToken.get('/user/notification');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error?.response?.data || 'Error fetching notifications';
  }
};

const readNotificationStudent = async (notificationId) => {
  try {
    const response = await baseUrlWithToken.patch(`/user/notification/mark_as_readed/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error?.response?.data || 'Error marking notification as read';
  }
};

const deleteSelectStudentNotification = async (ids = []) => {
  try {
    if (!ids || ids.length === 0) {
      throw new Error('No IDs provided');
    }
    const response = await baseUrlWithToken.delete(`/user/notification/${ids.join(',')}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notifications:', error);
    throw error?.response?.data || 'Error deleting notifications';
  }
};

export { getNotificationStudent, readNotificationStudent, deleteSelectStudentNotification };
