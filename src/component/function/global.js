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

// token Image
const baseUrlWithTokenImg = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL_IMG
});
// make sure to include the token in the headers
baseUrlWithTokenImg.interceptors.request.use(
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

const get_all_class_room_include_inActive = async () => {
  try {
    const response = await baseUrl.get(`/class_room_select_include_inactive`);
    return response.data;
  } catch (error) {
    console.log('error at get_all_class_room_include_inActive: ', error);
    return [];
  }
};

export { get_all_class_room_include_inActive, baseUrlWithTokenImg };
