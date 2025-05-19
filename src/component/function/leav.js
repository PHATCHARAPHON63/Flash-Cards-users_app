import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_APP_API_URL}`;
export const baseEmail = `${import.meta.env.VITE_APP_URL_EMAIL}`;
export const baseLogin = `${import.meta.env.VITE_APP_URL_LOGIN}`;

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
///!ADMIN
export const get_leav_admin = async (level, date) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/leave_of_absence/get_leave_all`, {
      params: { level, date }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_leave_class = async (level, room, student_id, date) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/leave_of_absence/get_leave_class`, {
      params: { level, room, student_id, date }
    });
    return response.data.at(-1);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_leave_personal = async (id, year, semester) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/leave_of_absence/get_leave_personal`, {
      params: { id, year, semester }
    });
    return response.data.at(-1);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const update_leave = async (data) => {
  try {
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/leave_of_absence/update_leave`, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const create_leave_admin_image = async (data) => {
  try {
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/leave_of_absence/create_image_leave`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err.response.data.message;
  }
};

export const create_leave_admin = async (data) => {
  try {
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/leave_of_absence/create_leave`, data);
    return response.data;
  } catch (err) {
    console.log(err.response.data.message);
    throw err.response.data.message;
  }
};

export const delete_leave = async (data) => {
  try {
    // console.log('API', data);
    // return;
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/leave_of_absence/delete_leave`, {
      params: data
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_leave_admim_by_id = async (id, level, room) => {
  try {
    console.log(id);
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/leave_of_absence/get_leave_by_id`, {
      params: { id, level, room }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err.response.data.message || 'Something went wrong!';
  }
};

///!STUDENT
export const get_leav = async () => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/leave_of_absence/test`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const create_leave = async (data) => {
  try {
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/user/leave_of_absence/create_leave`, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err.response.data.message;
  }
};

export const create_image_leave = async (data) => {
  try {
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/user/leave_of_absence/create_image_leave`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const get_leave = async (year, semester) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/leave_of_absence/get_leave`, {
      params: { year, semester }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
