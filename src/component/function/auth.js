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
export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await axios.post(`${baseUrl}/send_email_forgot_password`, { e_mail: email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
//export const login = async (values) => await axios.post(`${baseUrl}/login_admin`, values);
//export const login = async (values) => await axios.post(`${baseUrl}/login`, values);
export const getAllInformation = async () => await axios.get(`${baseUrl}/getAllInformation`);
export const getInformationById = async (id) => await axios.get(`${baseUrl}/getInformationById/${id}`);

export const deleteInformation = async (information_num) =>
  await axios.delete(`${baseUrl}/staff/information/deleteInformation/${information_num}`);

export const information = async (data) => await axios.post(`${baseUrl}/staff/information/information`, data);
export const informationPicture = async (number_information) =>
  await axios.get(`${baseUrl}/staff/information/informationPicture/${number_information}`);
export const informationUpdate = async (formData) => await axios.post(`${baseUrl}/staff/information/informationUpdate`, formData);

export const login_user = async (values) => {
  const { email, password } = values;

  try {
    const response = await axios.post(`${baseUrl}/login_user`, {
      email: email,
      password
    });

    // เก็บข้อมูลลงใน localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('role', response.data.role); // เพิ่มการเก็บ role
      localStorage.setItem('name', response.data.name);
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    localStorage.clear();
    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
export const currentUser = async (authtoken) =>
  await axios.post(
    `${baseUrl}/current-admin`,
    {},
    {
      headers: {
        authtoken
      }
    }
  );
export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return { isValid: false };

  try {
    const response = await axios.get(`${baseUrl}/staff/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { isValid: true, user: response.data.user };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token หมดอายุหรือไม่ถูกต้อง
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    return { isValid: false, error: error.response?.data?.message || 'Token verification failed' };
  }
};

export const validateResetToken = async (token, expiry) => {
  try {
    const response = await axios.get(`${baseUrl}/validate-reset-token`, { params: { token, expiry } });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${baseUrl}/forgot-password`, { token, newPassword });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
//Provinces
// export const getProvince = async () => await axios.get(`${baseUrl}/Provinces`);
export const getAmpur = async (id) => await axios.get(`${baseUrl}/Amphures/${id}`);
export const getTambon = async (id) => await axios.get(`${baseUrl}/Tombons/${id}`);
export const getZipcode = async (id) => await axios.get(`${baseUrl}/Zipcode/${id}`);
export const getData_user = async (id) => await axios.get(`${baseUrl}/get_by_gen_id/${id}`);
export const updade_by_gen_id = async (id) => await axios.get(`${baseUrl}/updade_by_gen_id/${id}`);
export const create_data_user = async (formData) => {
  try {
    const response = await axios.post(`${baseUrl}/create_data_user`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const upload_profile = async (formData) => {
  try {
    const response = await axios.post(`${baseUrl}/upload_profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    console.log(data);
    const response = await baseUrlWithToken.post('/updateProfileUser', data);
    return response;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // ส่งต่อ error ไปให้ผู้เรียกใช้จัดการ
  }
};

// export const getAlllearning = async () => await axios.get(`${baseUrl}/learningGetAll`);
export const informationPiccouse = async (learning_number) => await axios.get(`${baseUrl}/informationPiccouse/${learning_number}`);
export const getstreaming = async () => {
  try {
    const res = await axios.get(`${baseUrl}/getAllStreaming`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const learningView = async (id) => await axios.get(`${baseUrl}/learningView/${id}`);

export const NotificationsGetById = async (id) => {
  try {
    const res = await baseUrlWithToken.get(`${baseUrl}/NotificationsGetById/${id}`);
    return res.data.data;
  } catch (error) {
    console.log('Error', error);
  }
};

export const update_ReadStatus_notification = async (id) => {
  try {
    const res = await baseUrlWithToken.put(`${baseUrl}/notifications/${id}/read`);
    return res.data.data;
  } catch (error) {
    console.log('Error', error);
  }
};
export const deleteMultipleNotifications = async (notificationIds) => {
  try {
    const res = await baseUrlWithToken.delete(`${baseUrl}/notifications/delete-multiple`, {
      data: { notificationIds }
    });
    return res.data;
  } catch (error) {
    console.log('Error deleting notifications:', error);
    throw error;
  }
};
export const Noti_Count_GetById = async (id) => {
  try {
    const res = await baseUrlWithToken.get(`${baseUrl}/Noti_Count_GetById_user/${id}`);
    return res.data.data;
  } catch (error) {
    console.log('Error', error);
  }
};

export const getDataUser = async () => {
  try {
    const response = await baseUrlWithToken.get(`/getDataUser`);
    return response.data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
};
export const setImageData = async (imageData) => {
  try {
    const response = await baseUrlWithToken.post('/setImageDataProfileUser', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // เพิ่มการตรวจสอบ response
    if (response?.data?.success) {
      return response.data;
    } else {
      throw new Error(response?.data?.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // ส่งต่อ error ไปให้ผู้เรียกใช้จัดการ
  }
};
export const daily_attendance_summary = async () => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/main/daily-summary`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const attendance_summary = async (date, level = null) => {
  try {
    // สร้าง URL พร้อมพารามิเตอร์
    let url = `${import.meta.env.VITE_APP_API_URL}/staff/main/attendance-summary?date=${date}`;
    if (level) {
      url += `&level=${level}`;
    }

    const response = await baseUrlWithToken.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const get_all_attendance_history = async (date) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/main/get_all_attendance_history`, {
      params: { date }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const all_missing_students = async (date) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/main/all-missing-students`, {
      params: { date }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const all_leave_students = async (date) => {
  try {
    const response = await baseUrlWithToken.get(`${import.meta.env.VITE_APP_API_URL}/staff/main/all-leave-students`, {
      params: { date }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const data_profile_f = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/personal_data/data_profile_f`, { _id: userId });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const uploadProfileImage = async (imageData) => {
  try {
    // ดึง userId จาก localStorage
    const userId = localStorage.getItem('userId');

    const formData = imageData instanceof FormData ? imageData : new FormData();
    formData.append('userId', userId);

    const response = await baseUrlWithToken.post(`/staff/personal_data/upload_profile_image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error uploading image:', err);
    throw err;
  }
};

export const data_profile_student = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/user/personal_data/data_profile_student`, {
      _id: userId
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const upload_profile_image_student = async (imageData) => {
  try {
    // ดึง userId จาก localStorage
    const userId = localStorage.getItem('userId');

    const formData = imageData instanceof FormData ? imageData : new FormData();
    formData.append('userId', userId);

    const response = await baseUrlWithToken.post(`/user/personal_data/upload_profile_image_student`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error uploading image:', err);
    throw err;
  }
};

export const update_personal_data_student = async (profileData) => {
  try {
    const userId = localStorage.getItem('userId');

    const requestData = {
      userId,
      prefix: profileData.prefix,
      first_name: profileData.username,
      last_name: profileData.lastname,
      email: profileData.email,
      phone_number: profileData.phone,
      position: profileData.position
    };

    return await baseUrlWithToken.post(`/user/personal_data/update_personal_data_student`, requestData);
  } catch (err) {
    console.error('Error updating profile data:', err);
    throw err;
  }
};

export const update_personal_data_off = async (profileData) => {
  try {
    const userId = localStorage.getItem('userId');
    const requestData = {
      userId,
      prefix: profileData.prefix,
      first_name: profileData.username,
      last_name: profileData.lastname,
      email: profileData.email,
      phone_number: profileData.phone,
      position: profileData.position
    };
    return await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/personal_data/update_personal_data_off`, requestData);
  } catch (err) {
    console.error('Error updating profile data:', err);
    throw err;
  }
};

export const updatePassword = async (data) => {
  const userId = localStorage.getItem('userId');
  try {
    const requestData = {
      ...data,
      userId: userId
    };

    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/staff/personal_data/updatePasswordUser`, requestData);
    return response;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const updatePassword_std = async (data) => {
  const userId = localStorage.getItem('userId');
  try {
    const requestData = {
      ...data,
      userId: userId
    };

    const response = await baseUrlWithToken.post(`${import.meta.env.VITE_APP_API_URL}/user/personal_data/updatePasswordUser`, requestData);
    return response;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
