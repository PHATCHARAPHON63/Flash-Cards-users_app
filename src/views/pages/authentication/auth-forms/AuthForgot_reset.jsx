import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  IconButton,
  Popper,
  LinearProgress,
  ClickAwayListener
} from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton.jsx';
import { validateResetToken, resetPassword } from 'component/function/auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// ฟังก์ชันตรวจสอบความถูกต้องของรหัสผ่าน
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  return {
    isValid: Object.values(requirements).every((req) => req),
    requirements
  };
};

// ฟังก์ชันคำนวณความแข็งแรงของรหัสผ่าน
const calculatePasswordStrength = (password) => {
  let score = 0;
  let level = '';
  let color = '';

  if (password.length >= 8) score += 25;
  if (/(?=.*[a-z])/.test(password)) score += 15;
  if (/(?=.*[A-Z])/.test(password)) score += 15;
  if (/(?=.*[0-9])/.test(password)) score += 25;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;

  if (score >= 100) {
    level = 'ความปลอดภัยสูงมาก';
    color = '#2E7D32';
  } else if (score >= 80) {
    level = 'ความปลอดภัยสูง';
    color = '#4CAF50';
  } else if (score >= 60) {
    level = 'ความปลอดภัยปานกลาง';
    color = '#FFA726';
  } else if (score >= 30) {
    level = 'ความปลอดภัยต่ำ';
    color = '#F57C00';
  } else {
    level = 'ความปลอดภัยต่ำมาก';
    color = '#D32F2F';
  }

  return { score, level, color };
};

const Reset = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    level: '',
    color: '',
    requirements: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecial: false
    }
  });

  const [passwordFieldRef, setPasswordFieldRef] = useState(null);
  const [showPopper, setShowPopper] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const params = new URLSearchParams(location.search);
        let token = params.get('token');

        if (!token) {
          navigate('/forgot/expired');
          return;
        }

        if (token.includes(':')) {
          token = token.split(':')[0];
        }
        token = token.trim();

        const response = await validateResetToken(token);

        if (response && response.isValid) {
          setIsTokenValid(true);
          setEmail(response.email);
        } else {
          navigate('/forgot/expired');
        }
      } catch (error) {
        console.error('Complete error object:', error);
        navigate('/forgot/expired');
      }
    };

    checkToken();
  }, [navigate, location]);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (!isTokenValid) {
    return <Typography>Validating reset token...</Typography>;
  }

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}></Grid>
      </Grid>

      <Formik
        initialValues={{
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object().shape({
          newPassword: Yup.string()
            .test('password-strength', 'รหัสผ่านไม่ตรงตามข้อกำหนด', function (value) {
              const { isValid } = validatePassword(value || '');
              return isValid;
            })
            .required('กรุณากรอกรหัสผ่าน'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'รหัสผ่านไม่ตรงกัน')
            .required('กรุณายืนยันรหัสผ่าน')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            await resetPassword(token, values.newPassword);
            setStatus({ success: true });
            setSubmitting(false);
            navigate('/', { state: { message: 'Password reset successful. Please login with your new password.' } });
          } catch (err) {
            console.error('Password reset error:', err);
            setStatus({ success: false });
            setSubmitting(false);

            if (err.response && err.response.status === 401) {
              navigate('/', { state: { message: 'Password reset link has expired. Please request a new one.' } });
            } else {
              setErrorMessage(err.response?.data?.message || 'An error occurred. Please try again.');
            }
          }
        }}
      >
        {({ errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, values }) => {
          const handlePasswordChange = (e) => {
            handleChange(e);
            const { name, value } = e.target;
            if (name === 'newPassword') {
              const strength = calculatePasswordStrength(value);
              const { requirements } = validatePassword(value);
              setPasswordStrength({
                ...strength,
                requirements
              });
              if (value.length > 0) {
                setShowPopper(true);
              }
            }
          };

          return (
            <Form noValidate onSubmit={handleSubmit} {...others}>
              {errorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Typography>
              )}

              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  id="new-password-reset"
                  type={showPassword.newPassword ? 'text' : 'password'}
                  name="newPassword"
                  onChange={handlePasswordChange}
                  onFocus={() => {
                    if (values.newPassword.length > 0) {
                      setShowPopper(true);
                    }
                  }}
                  onBlur={(e) => {
                    // ถ้า blur ไปที่ช่อง confirm password
                    if (e.relatedTarget?.id === 'confirm-password-reset') {
                      setShowPopper(false);
                    }
                  }}
                  value={values.newPassword}
                  label="รหัสผ่านใหม่"
                  placeholder="รหัสผ่านใหม่"
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    ref: setPasswordFieldRef,
                    endAdornment: (
                      <IconButton
                        onClick={() => togglePasswordVisibility('newPassword')}
                        onMouseDown={(e) => e.preventDefault()} // ป้องกัน blur event
                      >
                        {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    )
                  }}
                />

                <Popper
                  open={showPopper && !!passwordFieldRef && values.newPassword.length > 0}
                  anchorEl={passwordFieldRef}
                  placement="bottom-start"
                  style={{ zIndex: 1300 }}
                >
                  <ClickAwayListener onClickAway={() => setShowPopper(false)}>
                    <Box
                      sx={{
                        bgcolor: 'background.paper',
                        p: 2,
                        borderRadius: 1,
                        maxWidth: 300,
                        boxShadow: (theme) => theme.shadows[3],
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ความปลอดภัยของรหัสผ่าน
                      </Typography>
                      {values.newPassword && (
                        <>
                          <Box sx={{ width: '100%', mb: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={passwordStrength.score}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: passwordStrength.color,
                                  borderRadius: 5
                                }
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 0.5,
                                color: passwordStrength.color,
                                textAlign: 'right',
                                fontWeight: 'bold'
                              }}
                            >
                              {passwordStrength.level}
                            </Typography>
                          </Box>

                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            รหัสผ่านต้องประกอบด้วย:
                          </Typography>
                          {[
                            { label: '8 ตัวอักษรหรือมากกว่า', check: passwordStrength.requirements.minLength },
                            { label: 'ตัวอักษรภาษาอังกฤษพิมพ์ใหญ่', check: passwordStrength.requirements.hasUpperCase },
                            { label: 'ตัวอักษรภาษาอังกฤษพิมพ์เล็ก', check: passwordStrength.requirements.hasLowerCase },
                            { label: 'ตัวเลขอย่างน้อย 1 หมายเลข', check: passwordStrength.requirements.hasNumber },
                            { label: 'อักขระพิเศษอย่างน้อย 1 ตัว', check: passwordStrength.requirements.hasSpecial }
                          ].map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              {item.check ? (
                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                              ) : (
                                <CancelOutlinedIcon color="error" fontSize="small" />
                              )}
                              <Typography variant="body2">{item.label}</Typography>
                            </Box>
                          ))}
                        </>
                      )}
                    </Box>
                  </ClickAwayListener>
                </Popper>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  id="confirm-password-reset"
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  onFocus={() => setShowPopper(false)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  label="ยืนยันรหัสผ่าน"
                  placeholder="ยืนยันรหัสผ่าน"
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => togglePasswordVisibility('confirmPassword')}>
                        {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    )
                  }}
                />
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#65C4B6',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#1a3f5c'
                      },
                      '&:disabled': {
                        backgroundColor: '#cccccc'
                      }
                    }}
                  >
                    ยืนยัน
                  </Button>
                </AnimateButton>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Reset;
