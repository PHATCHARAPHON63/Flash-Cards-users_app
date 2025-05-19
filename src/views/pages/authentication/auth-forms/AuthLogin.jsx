import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Button, IconButton, InputAdornment, Stack, TextField, Typography, useMediaQuery, Link, Alert, Divider } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login_user } from '../../../../component/function/auth';
import { useAuth } from '../../../../contexts/AuthContext';

const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState(null);
  const [remainingAttempts, setRemainingAttempts] = useState(3); // เริ่มต้นที่ 3 ครั้ง (ล็อกอินผิดได้ 3 ครั้ง)
  const [countdown, setCountdown] = useState(null);
  const { checkAuth, setUserRole } = useAuth();

  // ฟังก์ชันคำนวณเวลานับถอยหลัง
  useEffect(() => {
    let timer;
    if (unlockTime) {
      const updateCountdown = () => {
        const now = new Date();
        const unlockDate = new Date(unlockTime);
        const diffMs = unlockDate - now;

        if (diffMs <= 0) {
          // เมื่อครบเวลา ล้างข้อมูลการล็อคและข้อความแจ้งเตือน
          setIsLocked(false);
          setUnlockTime(null);
          setCountdown(null);
          setRemainingAttempts(3);
          setErrorMessage(''); // ล้างข้อความ error ด้วย
          clearInterval(timer);
        } else {
          // คำนวณนาทีและวินาที
          const minutes = Math.floor(diffMs / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setCountdown(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }
      };

      updateCountdown(); // อัปเดตทันที
      timer = setInterval(updateCountdown, 1000); // อัปเดตทุกวินาที
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [unlockTime]);

  const handleApiError = (error) => {
    if (!error.response) {
      return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้งในภายหลัง';
    }

    if (error.response.status === 423 && error.response.data.locked) {
      setIsLocked(true);
      setUnlockTime(error.response.data.unlockTime);
      return error.response.data.message;
    }

    if (error.response.status === 400 && error.response.data.remainingAttempts !== undefined) {
      setRemainingAttempts(error.response.data.remainingAttempts);
      return error.response.data.message;
    }

    switch (error.response.status) {
      case 400:
        return 'รหัสนักเรียน / อีเมล หรือ รหัสผ่านไม่ถูกต้อง';
      case 403:
        return 'บัญชีของคุณยังไม่ได้เปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ';
      case 404:
        return 'ไม่พบ ข้อมูล กรุณาตรวจสอบการตั้งค่าระบบหรือติดต่อผู้ดูแล';
      default:
        return error.response.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
    }
  };

  const clearLocalStorage = () => {
    const keysToRemove = ['token', 'name', 'img'];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const setLocalStorageData = (data) => {
    try {
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name || '');
      localStorage.setItem('img', data.img || '');

      console.log('บันทึกข้อมูลลง localStorage:', {
        token: data.token?.substring(0, 20) + '...',
        name: data.name,
        img: data.img
      });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
      throw new Error('ไม่สามารถบันทึกข้อมูลผู้ใช้ได้');
    }
  };

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    setErrorMessage('');
    setAttemptedSubmit(true);
    if (isLocked) {
      setErrorMessage(`บัญชีของคุณถูกล็อคชั่วคราว กรุณาลองอีกครั้งในอีก ${countdown || '5 นาที'}`);
      setSubmitting(false);
      return;
    }

    try {
      const response = await login_user(values);
      console.log('response.data', response.data);

      const role = response.data?.role;
      const name = response.data?.name;
      const img = response.data?.img;
      if (response.data?.token) {
        setIsLocked(false);
        setUnlockTime(null);
        setRemainingAttempts(3);

        setLocalStorageData(response.data);
        await checkAuth();
        if (role === 'admin') {
          setUserRole('admin');
          navigate('/admin/main-menu');
        }
        if (role === 'student') {
          setUserRole('student');
          navigate('/student/learning-stats');
        }
      } else {
        throw new Error('ข้อมูลที่ได้รับจากเซิร์ฟเวอร์ไม่ถูกต้อง');
      }
    } catch (err) {
      clearLocalStorage();
      setErrorMessage(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      {errorMessage && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              color: '#FFFFFF'
            }
          }}
        >
          {errorMessage}
        </Alert>
      )}
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().required('กรุณากรอกข้อมูล'),
          password: Yup.string().required('กรุณากรอกข้อมูล')
        })}
        onSubmit={handleLoginSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                id="outlined-adornment-username-login"
                type="text"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setAttemptedSubmit(false);
                }}
                placeholder="รหัสนักเรียน / อีเมล *"
                error={attemptedSubmit && Boolean(errors.email)}
                helperText={attemptedSubmit && errors.email}
                InputLabelProps={{ shrink: false }}
                label=""
                disabled={isLocked}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setAttemptedSubmit(false);
                }}
                placeholder="รหัสผ่าน *"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        disabled={isLocked}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={attemptedSubmit && Boolean(errors.password)}
                helperText={attemptedSubmit && errors.password}
                InputLabelProps={{ shrink: false }}
                label=""
                disabled={isLocked}
              />
            </Box>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Link
                href="/register"
                sx={{
                  color: '#7D7D7D', // แก้ตรงนี้
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                สมัครสมาชิก
              </Link>
            </Stack>
            <Box sx={{ mt: 2 }}>
              <Button
                disableElevation
                disabled={isSubmitting || isLocked}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={() => setAttemptedSubmit(true)}
                sx={{
                  backgroundColor: '#65C4B6',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#65C4B6'
                  },
                  '&:disabled': {
                    backgroundColor: '#cccccc'
                  }
                }}
              >
                {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : isLocked ? 'บัญชีถูกล็อคชั่วคราว' : 'เข้าสู่ระบบ'}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
