import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Typography, useMediaQuery, Alert, Stack, CircularProgress } from '@mui/material';
import { updade_by_gen_id, getData_user } from 'component/function/auth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Image from 'assets/images/Group 554.png';

const ForgotExpired = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [isValidLogin, setIsValidLogin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  // ดึง gen_id จาก URL และเก็บไว้ในตัวแปร
  const currentGenId = location.pathname.split('/verify_identity/')[1];

  const checkLastLogin = (lastLoginDate) => {
    const currentDate = new Date();
    const lastLogin = new Date(lastLoginDate);
    return lastLogin > currentDate;
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleVerification = async (genId) => {
    if (!genId) {
      console.error('No genId provided for verification');
      setErrorMessage('ไม่พบรหัสยืนยันตัวตน');
      return;
    }

    setIsVerifying(true);
    setVerificationStep(1);

    try {
      console.log('Verifying with genId:', genId);

      const response = await updade_by_gen_id(genId);
      console.log('Verification response:', response);

      if (response.data.status === 'success') {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setVerificationStep(2);

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'การยืนยันไม่สำเร็จ');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดในการยืนยันข้อมูล');
      setIsVerifying(false);
      setVerificationStep(0);
    }
  };

  const fetchUserData = async (genId) => {
    if (!genId) {
      console.error('No genId provided for fetching user data');
      setErrorMessage('ไม่พบรหัสยืนยันตัวตน');
      return;
    }

    try {
      const response = await getData_user(genId);
      const data = response.data.data;
      setUserData(data);

      if (data.last_login) {
        const isValid = checkLastLogin(data.last_login);
        setIsValidLogin(isValid);
        if (isValid) {
          handleVerification(genId);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorMessage('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    }
  };

  useEffect(() => {
    if (currentGenId) {
      console.log('Current genId from URL:', currentGenId);
      fetchUserData(currentGenId);
    } else {
      console.error('No genId found in URL');
      setErrorMessage('ไม่พบรหัสยืนยันตัวตน');
    }
  }, [currentGenId]);

  const renderVerificationStatus = () => {
    if (verificationStep === 1) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: '#05255B' }} />
          <Typography variant="h6" color="#05255B">
            กำลังยืนยันการสมัครสมาชิก...
          </Typography>
        </Box>
      );
    }

    if (verificationStep === 2) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 60 }} />
          <Typography variant="h6" color="success.main">
            ยืนยันการสมัครสมาชิกสำเร็จ
          </Typography>
        </Box>
      );
    }

    return null;
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            {userData && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {isValidLogin ? (
                  renderVerificationStatus()
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Grid container direction="column" spacing={2} sx={{ mt: 3 }}>
                      <Grid
                        item
                        sx={{
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                          maxWidth: '80px',
                          margin: '0 auto'
                        }}
                      >
                        <Stack spacing={1} alignItems="center" sx={{ width: '100%' }}>
                          <img
                            src={Image}
                            alt="Forgot Password"
                            style={{
                              width: '60%',
                              height: 'auto',
                              display: 'block',
                              minWidth: '60px',
                              objectFit: 'contain'
                            }}
                          />
                        </Stack>
                      </Grid>
                      <Typography fontSize="18px" color="#05255B" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
                        ลิงก์ยืนยันสมาชิกหมดอายุ
                      </Typography>
                      <Grid item>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={handleRegister}
                          sx={{
                            padding: '6px 12px',
                            height: 'auto',
                            minWidth: 'min-content',
                            color: '#05255B',
                            borderColor: '#05255B',
                            '&:hover': {
                              borderColor: '#05255B'
                            }
                          }}
                        >
                          ไปหน้าสมัครสมาชิก
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleBackToHome}
                          sx={{
                            padding: '6px 12px',
                            height: 'auto',
                            minWidth: 'min-content',
                            width: '300px',
                            backgroundColor: '#05255B',
                            '&:hover': {
                              backgroundColor: '#05255B'
                            }
                          }}
                        >
                          กลับหน้าเข้าสู่ระบบ
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ForgotExpired;
