import { Link } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, Box, Avatar } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthForgotExpired from '../auth-forms/Auth_verify_identity';
import logoImage from 'assets/images/Tlogical_icon.png';
//<AuthForgotExpired />
// ================================|| AUTH3 - FORGOT PASSWORD EXPIRED ||================================ //

const ForgotExpired = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container sx={{ width: '100%', height: '100vh' }}>
        <Grid container spacing={0} justifyContent="center">
          {/* Left side with logo - Hide on small screens */}
          {!matchDownMD && (
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              sx={{
                background: '#f8f8f8',
                position: 'relative'
              }}
            >
              {!matchDownMD && ( // เพิ่มเงื่อนไขนี้สำหรับ logo
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
              )}

              {/* ส่วน Copyright ที่มีอยู่เดิม */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 3,
                  left: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  '@media (max-width: 900px)': {
                    display: 'none'
                  }
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'black',
                    fontSize: '12px',
                    opacity: 0.7
                  }}
                >
                  © ๅ
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'black',
                    fontSize: '12px',
                    opacity: 0.7,
                    '& a': {
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }
                  }}
                >
                  การเปลี่ยนแปลงทางดิจิตอลโดย
                  <a href="https://www.tlogical.com" target="_blank" rel="noopener noreferrer">
                    {' '}
                    THANATHAM EDUCATION CO.,LTD.
                  </a>
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Right side - Reset password form */}
          <Grid
            item
            xs={matchDownMD ? 12 : 6}
            sx={{
              background: '#FFFFFF',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
              <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0, width: '100%', maxWidth: '450px' }}>
                {/* <AuthCardWrapper> */}
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'}>
                      <Grid item sx={{ mb: 2 }}>
                        <Stack spacing={1}>{/* Empty Typography for spacing */}</Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthForgotExpired />
                  </Grid>
                </Grid>
                {/* </AuthCardWrapper> */}
              </Grid>
            </Grid>

            {/* Mobile footer */}
            {matchDownMD && (
              <Box
                sx={{
                  width: '100%',
                  padding: '10px',
                  background: '#0E2130',
                  textAlign: 'center'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontSize: '9px',
                    opacity: 0.7,
                    display: 'block',
                    mb: 1
                  }}
                >
                  ©
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontSize: '10px',
                    opacity: 0.7
                  }}
                >
                  การเปลี่ยนแปลงทางดิจิตอลโดย{' '}
                  <a
                    href="https://www.tlogical.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'white',
                      textDecoration: 'underline'
                    }}
                  >
                    THANATHAM EDUCATION CO.,LTD.
                  </a>
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ForgotExpired;
