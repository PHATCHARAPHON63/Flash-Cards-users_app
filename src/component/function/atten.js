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

//! ADMIN
export const get_attend_personal = async (id, selectedYear, selectedSemester) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/attend/personal`, {
      params: { id, selectedYear, selectedSemester }
    });
    return response.data[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_attend_all = async (level, date) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/attend/all_room`, {
      params: { level, date }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_attend_class = async (class_level, room, student_id, date_time) => {
  try {
    console.log(class_level, room, student_id, date_time);
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/attend/class_room`, {
      params: {
        classlevel: class_level,
        room,
        student_id,
        date: date_time
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_attend_personal_semester = async (id) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/attend/personal_semester`, {
      params: { id }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const create_attend_personal = async (data) => {
  try {
    const response = await baseUrlWithToken.post(`/staff/attend/add_attend_personal`, { data });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

///! STUDENT

export const get_attend_personal_student = async (selectedSemester, selectedYear) => {
  try {
    console.log(selectedSemester, selectedYear);
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/attend/personal`, {
      params: { selectedSemester, selectedYear }
    });
    return response.data[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_attend_personal_semester_student = async () => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/attend/personal_semester`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
