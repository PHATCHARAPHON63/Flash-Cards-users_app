import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // ฟังก์ชันล้างข้อมูล authentication และนำทางกลับไปหน้าแรก
  const clearAuthData = useCallback(
    (redirect = false) => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');
      localStorage.removeItem('type_id');
      localStorage.removeItem('gen_id');
      setUser(null);

      // ถ้าต้องการให้นำทางกลับไปหน้าแรก
      if (redirect) {
        navigate('/');
      }
    },
    [navigate]
  );

  // ฟังก์ชันคำนวณเวลาที่เหลือก่อนโทเค็นหมดอายุ (หน่วยเป็นมิลลิวินาที)
  const getTokenTimeRemaining = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return 0;

      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload.exp) return 0;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = payload.exp - currentTime;

      // ถ้าเหลือเวลาน้อยกว่า 0 แสดงว่าหมดอายุแล้ว
      return timeRemaining > 0 ? timeRemaining * 1000 : 0;
    } catch (error) {
      console.error('Error calculating token expiration:', error);
      return 0;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');

    // ถ้าไม่มี token ใน localStorage
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // แยกข้อมูลจาก token โดยตรง
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));

        // ตรวจสอบว่า token หมดอายุหรือไม่
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > currentTime) {
          // Token ยังไม่หมดอายุ - set user
          setUser({
            id: payload._id,
            role: payload.role,
            active: payload.active
          });

          // อาจเก็บข้อมูลบางส่วนใน localStorage เพื่อใช้ในที่อื่น (ถ้าต้องการ)
          if (payload.name) localStorage.setItem('name', payload.name);
          if (payload.email) localStorage.setItem('email', payload.email);
          if (payload._id) localStorage.setItem('userId', payload._id);

          // ตั้งเวลาตรวจสอบใหม่ก่อนที่โทเค็นจะหมดอายุ
          const timeRemaining = getTokenTimeRemaining();
          if (timeRemaining > 0) {
            // ตั้งเวลาให้ตรวจสอบใหม่ก่อนที่โทเค็นจะหมดอายุ 1 นาที
            // หรือในครึ่งหนึ่งของเวลาที่เหลือ (เลือกค่าที่น้อยกว่า)
            const checkDelay = Math.min(timeRemaining - 60000, timeRemaining / 2);
            if (checkDelay > 1000) {
              // ถ้าเวลาที่เหลือมากกว่า 1 วินาที
              setTimeout(checkAuth, checkDelay);
            }
          }
        } else {
          // Token หมดอายุ - ล้างข้อมูลและเปลี่ยนเส้นทางไปยังหน้าแรก
          console.log('Token expired');
          clearAuthData(true);
        }
      } else {
        // Token format ไม่ถูกต้อง
        console.error('Invalid token format');
        clearAuthData(true);
      }
    } catch (error) {
      console.error('Error parsing token:', error);
      clearAuthData(true);
    }

    setLoading(false);
  }, [clearAuthData, getTokenTimeRemaining]);

  // ฟังก์ชันสำหรับตรวจสอบสิทธิ์ในการเข้าถึงเมนูหรือหน้า
  const hasAccess = useCallback(
    (requiredRole) => {
      if (!user) return false;
      return user.role === requiredRole && user.active === true;
    },
    [user]
  );

  // เพิ่มการตรวจสอบก่อนที่จะมีการนำทางหน้า
  const checkAuthBeforeNavigation = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        clearAuthData(true);
        return;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (!payload.exp || payload.exp <= currentTime) {
        clearAuthData(true);
        return;
      }
    } catch (error) {
      clearAuthData(true);
    }
  }, [clearAuthData]);

  // ตรวจสอบ token เมื่อ component mount และเมื่อมีการเปลี่ยนหน้า
  useEffect(() => {
    checkAuth();

    // เพิ่ม event listener สำหรับเมื่อมีการเปลี่ยนหน้า
    window.addEventListener('popstate', checkAuthBeforeNavigation);

    return () => {
      window.removeEventListener('popstate', checkAuthBeforeNavigation);
    };
  }, [checkAuth, checkAuthBeforeNavigation]);

  const setUserRole = useCallback((role) => {
    setRole(role);
  }, []);

  const getUserRole = useCallback(() => {
    return role;
  }, [role]);

  const value = {
    user,
    setUser,
    loading,
    checkAuth,
    clearAuthData,
    hasAccess,
    isAuthenticated: !!user,
    setUserRole,
    getUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
