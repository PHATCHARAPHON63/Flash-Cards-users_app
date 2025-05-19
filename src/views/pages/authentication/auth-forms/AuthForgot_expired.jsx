import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, Grid, TextField, Typography, useMediaQuery, Alert } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton.jsx';
import { styled } from '@mui/material/styles';
import { sendResetPasswordEmail } from 'component/function/auth'; // Import the function

const ForgotExpired = ({ ...others }) => {
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
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography gutterBottom fontWeight="bold" fontSize="16px">
              ลิงก์ของคุณหมดอายุแล้ว
            </Typography>
            <Typography fontSize="16px">กรุณากรอกอีเมลที่ใช้ส่งข้อมูลเพื่อยืนยันตัวตนอีกครั้ง</Typography>
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
            await sendResetPasswordEmail(values.email);
            setStatus({ success: true });
            setSubmitting(false);
            navigate('/forgot/message');
          } catch (err) {
            console.error('Password reset error:', err);
            setStatus({ success: false });
            setErrorMessage(err.message || 'An error occurred. Please try again.');
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* <FormControl fullWidth sx={{ mb: 3 }}>
              <TextField
                id="outlined-adornment-email-forgot"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setAttemptedSubmit(false);
                }}
                label={
                  <span>
                    อีเมล<RedAsterisk>*</RedAsterisk>
                  </span>
                }
                placeholder="กรอกอีเมล"
                error={attemptedSubmit && Boolean(errors.email)}
                helperText={attemptedSubmit && errors.email}
                InputLabelProps={{
                  shrink: true
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: attemptedSubmit && Boolean(errors.email) ? 'red' : 'inherit'
                    }
                  },
                  '& .MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                    backgroundColor: 'white',
                    padding: '0 4px'
                  }
                }}
              />
            </FormControl> */}

            {/* <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: '#0E2130',
                    '&:hover': {
                      backgroundColor: '#0E2130'
                    }
                  }}
                  onClick={() => setAttemptedSubmit(true)}
                >
                  ยืนยัน
                </Button>
              </AnimateButton>
            </Box> */}
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
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

export default ForgotExpired;
