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

export const get_attend_personal_student = async (id, selectedYear, selectedSemester) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/main/personal`, {
      params: { id, selectedYear, selectedSemester }
    });
    return response.data[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_attend_personal_semester_student = async (id) => {
  try {
    // ส่งตรง userId จาก localStorage ไปที่ API
    // ฝั่ง backend จะหา email และค้นหาในตาราง student ให้
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/main/personal_semester`, {
      params: { id }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const student_lates = async (userId, selectedYear, selectedSemester) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/main/student_late`, {
      params: {
        id: userId,
        selectedYear: selectedYear,
        selectedSemester: selectedSemester
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const student_leaves = async (userId, selectedYear, selectedSemester) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/main/student_leave_semester`, {
      params: {
        id: userId,
        selectedYear: selectedYear,
        selectedSemester: selectedSemester
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const student_absent_days = async (userId, selectedYear, selectedSemester) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/main/student_absent_days`, {
      params: {
        id: userId,
        selectedYear: selectedYear,
        selectedSemester: selectedSemester
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};


export const student_late_days = async (userId, selectedYear, selectedSemester) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/user/main/student_late_days`, {
      params: {
        id: userId,
        selectedYear: selectedYear,
        selectedSemester: selectedSemester
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};