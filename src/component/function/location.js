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

const get_provinces = async () => {
  try {
    const response = await baseUrl.get(`/location/province`);
    return response.data;
  } catch (error) {
    console.log('error at get_provinces: ', error);
    return [];
  }
};

const get_amphoe_by_province_id = async (province_id) => {
  try {
    const response = await baseUrl.get(`/location/amphoe_by_province_id/${province_id}`);
    return response.data;
  } catch (error) {
    console.log('error at get_amphoe_by_province_id: ', error);
    return [];
  }
};

const get_tambon_by_amphoe_id = async (amphoe_id) => {
  try {
    const response = await baseUrl.get(`/location/tambon_by_amphoe_id/${amphoe_id}`);
    return response.data;
  } catch (error) {
    console.log('error at get_tambon_by_amphoe_id: ', error);
    return [];
  }
};

export { get_provinces, get_amphoe_by_province_id, get_tambon_by_amphoe_id };
