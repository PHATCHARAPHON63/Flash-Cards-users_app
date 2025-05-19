import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, Box, Avatar } from '@mui/material';
import logoImage from 'assets/images/Tlogical_icon.png';
import logoImageT from 'assets/images/Tlogical_Logo_Navy.png';
import logoT from 'assets/images/TTE.png';
// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo.jsx';
import AuthFooter from 'ui-component/cards/AuthFooter';
import img from 'assets/images/img.png';
// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Grid container spacing={0} justifyContent="center">
          {/* Left side with background (ฝั่งซ้ายที่มีพื้นหลัง) */}
          {!matchDownMD && (
            <Grid
              item
              xs={6}
              sx={{
                background: '#f8f8f8',
                position: 'relative',
                height: '100vh'
              }}
            >
              {/* Logo */}
              {/* <Box
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
            </Box> */}
              {/* <Box
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
              </Box> */}

              {/* ลบ Footer จากฝั่งซ้าย */}
            </Grid>
          )}

          {/* Right side with login form (ฝั่งขวาที่มีฟอร์มล็อกอิน) */}
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            sx={{
              background: '#FFFFFF',
              width: {
                xs: '100%',
                md: '50%'
              },
              height: '100%',
              position: 'relative' // เพิ่ม position relative เพื่อให้สามารถใช้ position absolute กับข้อความลิขสิทธิ์ได้
            }}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{
                minHeight: 'calc(100vh - 68px)'
                // height: '100%'
              }}
            >
              <Grid
                item
                sx={{
                  m: { xs: 1, sm: 3 },
                  mb: 0
                  // width: '100%',
                  // maxWidth: { xs: '95%', sm: '80%', md: '600px' },
                  // px: { xs: 2, sm: 3, md: 4 }
                }}
              >
                <AuthCardWrapper>
                  <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                      <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} spacing={2}>
                        {/* Add logo for small screens */}

                        <Grid item xs={12}>
                          <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} spacing={2}>
                            <Grid item xs={12}>
                              <Box
                                sx={{
                                  mb: { xs: 2, sm: 3 },
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center' // จัดให้องค์ประกอบใน Box อยู่ตรงกลางในแนวนอน
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{
                                    fontWeight: 500,
                                    textAlign: 'center', // จัดข้อความให้อยู่ชิดซ้าย
                                    fontSize: {
                                      xs: '0.9rem',
                                      sm: '0.9rem',
                                      md: '1.2rem'
                                    },
                                    lineHeight: {
                                      xs: 1.5,
                                      sm: 1.8,
                                      md: 2
                                    },
                                    width: '100%', // กำหนดให้กว้างเต็มพื้นที่เพื่อให้การจัดซ้ายมีผล
                                    color: '#0E2130',
                                    letterSpacing: '0.5px',
                                    mt: 2 // เพิ่มระยะห่างระหว่างโลโก้กับข้อความ
                                  }}
                                >
                                  ยินดีต้อนรับเข้าสู่ระบบ Flash Cards
                                  <br />
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <AuthLogin />
                    </Grid>
                  </Grid>
                </AuthCardWrapper>
              </Grid>
            </Grid>

            {/* ข้อความลิขสิทธิ์อยู่ฝั่งขวาล่าง */}
            {!matchDownMD && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 2,
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

export default Login;
