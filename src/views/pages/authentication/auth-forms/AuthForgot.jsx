import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, Grid, TextField, Typography, useMediaQuery, Alert } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton.jsx';
import { styled } from '@mui/material/styles';

import { sendResetPasswordEmail } from 'component/function/auth';

const ForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const [errorMessage, setErrorMessage] = useState('');

  const RedAsterisk = styled('span')({
    color: 'red'
  });

  const handleSubmit = async (values) => {
    try {
      await sendResetPasswordEmail(values.email);
      navigate('/forgot/message');
    } catch (error) {
      setErrorMessage('กรุณาตรวจสอบอีเมลใหม่อีกครั้ง');
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
          email: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').max(255).required('กรุณากรอกอีเมล')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <TextField
                id="outlined-adornment-email-forgot"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label={
                  <span>
                    ระบุอีเมล<RedAsterisk>*</RedAsterisk>
                  </span>
                }
                // placeholder="ระบุอีเมล *"
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                InputLabelProps={{
                  shrink: true
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: touched.email && errors.email ? 'red' : 'inherit'
                    },
                    '& input': {
                      '&::selection': {
                        backgroundColor: 'transparent'
                      },
                      '&::-moz-selection': {
                        backgroundColor: 'transparent'
                      }
                    }
                  },
                  '& .MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                    backgroundColor: 'white',
                    padding: '0 4px'
                  }
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
                    '&:hover': {
                      backgroundColor: '#65C4B6'
                    }
                  }}
                >
                  ยืนยัน
                </Button>
              </AnimateButton>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                sx={{
                  backgroundColor: '#FFFFFF',
                  color: '#05255B',
                  borderColor: '#65C4B6',

                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    borderColor: '#65C4B6'
                  }
                }}
                onClick={() => navigate('/Login')}
              >
                กลับหน้าหลัก
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPassword;
