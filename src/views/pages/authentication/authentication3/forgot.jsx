import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, useMediaQuery, Box } from '@mui/material';
import AuthWrapper1 from '../AuthWrapper1';
import AuthForgot from '../auth-forms/AuthForgot';
import img from 'assets/images/img.png';
const Forgot = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container sx={{ width: '100%', height: '100vh' }}>
        {/* Left side */}
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
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center', 
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

            {/* ลบ Footer จากฝั่งซ้าย */}
          </Grid>
        )}

        {/* Right side */}
        <Grid
          item
          xs={matchDownMD ? 12 : 6}
          sx={{
            background: '#FFFFFF',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative' // เพิ่ม position relative
          }}
        >
          {/* Main Content */}
          <Grid container justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
            <Grid item sx={{ width: '100%', maxWidth: '450px', px: 3 }}>
              {/* <AuthCardWrapper> */}
              <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                  <Grid container direction={matchDownSM ? 'column-reverse' : 'row'}>
                    <Grid
                      item
                      sx={{
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'left',
                        width: '100%'
                      }}
                    >
                      <Stack spacing={1} alignItems="">
                        <Typography variant="h3" textAlign="left">
                          ลืมรหัสผ่าน ?
                        </Typography>
                        <Typography variant="h5" textAlign="left">
                          กรอกอีเมลที่ใช้ลงทะเบียนเพื่อทำการตั้งรหัสผ่านใหม่
                        </Typography>
                        <Typography variant="h5" textAlign="left">
                          กรณีเป็นนักเรียน กรุณาติดต่อเจ้าหน้าที่
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <AuthForgot />
                </Grid>
              </Grid>
              {/* </AuthCardWrapper> */}
            </Grid>
          </Grid>

          {/* ข้อความลิขสิทธิ์อยู่ตรงกลางด้านล่าง (เหมือน ForgotMessage) */}
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
                justifyContent: 'center', // เปลี่ยนเป็น center แทน flex-end
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
                  textAlign: 'center', // เปลี่ยนเป็น center แทน right
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

          {/* Mobile Footer */}
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
    </AuthWrapper1>
  );
};

export default Forgot;
