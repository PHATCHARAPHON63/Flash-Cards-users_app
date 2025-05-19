import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, Grid, TextField, Typography, useMediaQuery, Alert } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton.jsx';
import { styled } from '@mui/material/styles';

const Forgotmessage = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const [errorMessage, setErrorMessage] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const RedAsterisk = styled('span')({
    color: 'red'
  });

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2
              }}
            >
              กรุณาตรวจสอบอีเมลของคุณ
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5">เราได้ทำการส่งอีเมลแล้ว โปรดตรวจสอบอีเมลของคุณเพื่อสร้างรหัสผ่านใหม่</Typography>
          </Box>
        </Grid>
      </Grid>

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
          email: Yup.string().email('Must be a valid email').max(255).required('กรุณากรอกอีเมล')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setErrorMessage('');
          setAttemptedSubmit(true);
          try {
            // Here you would typically call an API to handle password reset
            console.log('Password reset requested for:', values.email);
            setStatus({ success: true });
            setSubmitting(false);
            // Navigate to a confirmation page or show a success message
          } catch (err) {
            console.error('Password reset error:', err);
            setStatus({ success: false });
            setErrorMessage('An error occurred. Please try again.');
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* Removed email input field */}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2
              }}
            >
              <Button
                onClick={() => navigate('/Login')}
                size="large"
                type="submit"
                variant="contained"
                sx={{
                  width: '80%', // กำหนดความกว้างเป็น 90%
                  backgroundColor: '#65C4B6',
                  '&:hover': {
                    backgroundColor: '#65C4B6'
                  }
                }}
              >
                กลับหน้าหลัก
              </Button>

              <Box sx={{ mt: 2 }}>
                {/* <Button
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
                </Button> */}
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Forgotmessage;
