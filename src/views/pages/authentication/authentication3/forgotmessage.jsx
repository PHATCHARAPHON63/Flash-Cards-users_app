import { Link } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, Box, Avatar } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthForgotmessage from '../auth-forms/AuthForgotmessage';
import Logo from 'ui-component/Logo.jsx';
import AuthFooter from 'ui-component/cards/AuthFooter';
import logoImage from 'assets/images/Tlogical_icon.png';
import img from 'assets/images/img.png';

import Image from 'assets/images/Group 556.png';
import logoImageT from 'assets/images/Tlogical_Logo_White.png';
import User1 from 'assets/images/users/user-round.svg';

// ================================|| AUTH3 - FORGOT MESSAGE ||================================ //

const ForgotMessage = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Grid container spacing={0} justifyContent="center">
          {/* Left side with logo - Hide on small screens */}
          {!matchDownMD && (
            <Grid item xs={12} sm={12} md={7} lg={7} sx={{ background: '#f8f8f8', position: 'relative' }}>
              {/* {!matchDownMD && ( // เพิ่มเงื่อนไขนี้สำหรับ logo
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 1
                  }}
                >
                  <Link to="/">
                    <img
                      src={logoImage}
                      alt="Main Logo"
                      style={{
                        width: '121px',
                        height: 'auto',
                        objectFit: 'contain',
                        cursor: 'pointer'
                      }}
                    />
                  </Link>
                </Box>
              )} */}

              {/* เพิ่มรูปภาพที่ฝั่งซ้ายล่าง */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center', // จัดให้อยู่ตรงกลาง
                  '@media (max-width: 900px)': {
                    display: 'none'
                  }
                }}
              >
                <img
                  src={img}
                  alt="Bottom Center Logo"
                  style={{
                    width: '350px',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Grid>
          )}

          {/* Right side with forgot message */}
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={5}
            sx={{
              background: '#FFFFFF',
              width: {
                xs: '100%',
                md: 'auto'
              },
              position: 'relative' // เพิ่ม position relative เพื่อให้สามารถใช้ position absolute กับข้อความลิขสิทธิ์
            }}
          >
            <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
              <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0, width: '100%', maxWidth: '450px' }}>
                {/* <AuthCardWrapper> */}
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'}>
                      <Grid
                        item
                        sx={{
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%'
                        }}
                      >
                        <Stack spacing={1} alignItems="center">
                          <img
                            src={Image}
                            alt="Forgot Password"
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              display: 'block'
                            }}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthForgotmessage />
                  </Grid>
                </Grid>
                {/* </AuthCardWrapper> */}
              </Grid>
            </Grid>

            {/* ข้อความลิขสิทธิ์อยู่ฝั่งขวาล่าง (จัดกลาง) */}
            {!matchDownMD && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 3,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  '@media (max-width: 900px)': {
                    display: 'none'
                  }
                }}
              >
                {/* <Typography
                  variant="caption"
                  sx={{
                    color: 'black',
                    fontSize: '12px',
                    opacity: 0.7,
                    textAlign: 'center',
                    '& a': {
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }
                  }}
                >
                  &copy; 2025 COPYRIGHT
                  <a href="https://www.tlogical.com" target="_blank" rel="noopener noreferrer">
                    {' '}
                    THANATHAM EDUCATION CO.,LTD.
                  </a>
                </Typography> */}
              </Box>
            )}

            {/* Mobile footer */}
            {matchDownMD && (
              <Box
                sx={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '10px',
                  background: 'white',
                  gap: '8px'
                }}
              >
                {/* <Typography
                  variant="caption"
                  sx={{
                    color: '#0E2130',
                    fontSize: '10px',
                    opacity: 0.7,
                    textAlign: 'center'
                  }}
                >
                  &copy; 2025 COPYRIGHT{' '}
                  <a
                    href="https://www.tlogical.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#0E2130',
                      textDecoration: 'underline'
                    }}
                  >
                    THANATHAM EDUCATION CO.,LTD.
                  </a>
                </Typography> */}
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ForgotMessage;
