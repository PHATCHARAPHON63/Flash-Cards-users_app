import axios from 'axios';

// ใช้ค่าจาก .env
export const baseUrl = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

// สร้าง instance axios ที่มีการแนบ token อัตโนมัติ
const baseUrlWithToken = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

// Interceptor สำหรับเพิ่ม token ในทุก request
baseUrlWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // เพิ่ม "Bearer " นำหน้า token
    } else {
      throw new Error('ไม่พบ token กรุณาเข้าสู่ระบบอีกครั้ง');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor สำหรับจัดการข้อผิดพลาดที่พบบ่อย เช่น token หมดอายุ
baseUrlWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token หมดอายุหรือไม่ถูกต้อง
      localStorage.removeItem('token');
      // ถ้ามีการใช้ state management อย่าง Redux หรือ Context API
      // คุณสามารถเรียกใช้ action หรือ function เพื่อล้างสถานะการล็อกอินได้ที่นี่

      // ถ้าต้องการเปลี่ยนเส้นทางไปยังหน้าล็อกอิน (ขึ้นอยู่กับการใช้งาน React Router)
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ฟังก์ชันสำหรับการลงทะเบียน (ไม่ต้องการ token)
const register = async (formData) => {
  try {
    const response = await baseUrl.post(`/auth/register`, formData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // ส่งข้อความผิดพลาดจากเซิร์ฟเวอร์กลับไป
      throw new Error(error.response.data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    }
    console.error('error at register: ', error);
    throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
  }
};

// ฟังก์ชันสำหรับการเข้าสู่ระบบ (ไม่ต้องการ token)
const login = async (credentials) => {
  try {
    const response = await baseUrl.post(`/auth/login`, credentials);

    // เก็บ token ไว้ใน localStorage หลังจากล็อกอินสำเร็จ
    if (response.data && response.data.token) {
      localStorage.setItem('token', `Bearer ${response.data.token}`);
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
    console.error('error at login: ', error);
    throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
  }
};

// ฟังก์ชันสำหรับการออกจากระบบ
const logout = () => {
  localStorage.removeItem('token');
  // ถ้ามีการใช้ state management อย่าง Redux หรือ Context API
  // คุณสามารถเรียกใช้ action หรือ function เพื่อล้างสถานะการล็อกอินได้ที่นี่
};

// ฟังก์ชันสำหรับการดึงข้อมูลโปรไฟล์ผู้ใช้ (ต้องการ token)
const getUserProfile = async () => {
  try {
    const response = await baseUrlWithToken.get(`/user/profile`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์');
    }
    console.error('error at getUserProfile: ', error);
    throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
  }
};

// ส่งออกตัวแปรและฟังก์ชันที่ต้องการใช้
export { baseUrlWithToken, register, login, logout, getUserProfile };
