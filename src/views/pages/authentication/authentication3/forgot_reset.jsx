import { Link } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, useMediaQuery, Box } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthForgotReset from '../auth-forms/AuthForgot_reset';
import logoImage from 'assets/images/Tlogical_icon.png';
import Image from 'assets/images/Group 556.png'; // เพิ่มรูปภาพเหมือนในหน้าอื่นๆ
import img from 'assets/images/img.png';
// ================================|| AUTH3 - FORGOT PASSWORD RESET ||================================ //

const ForgotReset = () => {
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
            position: 'relative'
          }}
        >
          {/* Main Content */}
          <Grid container justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
            <Grid item sx={{ width: '100%', maxWidth: '450px', px: 3 }}>
              <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                  <Grid container direction={matchDownSM ? 'column-reverse' : 'row'}>
                    <Grid
                      item
                      sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'left',
                        width: '100%'
                      }}
                    >
                      <Stack spacing={1} alignItems="left">
                        <Typography variant="h3" textAlign="left">
                          เปลี่ยนรหัสผ่านใหม่
                        </Typography>
                        <Typography variant="h4" textAlign="left">
                          กรอกรหัสผ่านใหม่ที่คุณต้องการ
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <AuthForgotReset />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* ข้อความลิขสิทธิ์อยู่ตรงกลางด้านล่าง */}
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

export default ForgotReset;
